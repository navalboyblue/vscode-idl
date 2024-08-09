const Parser = require('./parser.js')
const { FileNotFound } = require('../def.js')
const { ForMeta, IncludeMeta, IfMeta, DefineMeta } = require('./meta.js')
const { DNode, TNode, VNode, ENode } = require('./node.js')
const { TString, TNumber, TVariable } = require('./expression.js')

function get_i (array_like, index) {
    if (index < 0) 
        index = array_like.length + index
    return array_like[index]
}

const META = ['for', 'include', 'if', 'elif', 'else', 'endif', 'endfor', 'define']

const KEY_WORD_INCLUDE = '<>'
const KEY_WORD_NODE = '<>=/'
const KEY_WORD_TEXT = '#<>\\'
const KEY_WORD_NORMAL_META = ''

const QUOT = "\'\""

const REG_VARIABLE = /^[\$_a-zA-Z][\$\w_]*$/
const REG_NUMBER = /^\d+$/
const KEY_WORD_EXPRESSION = ':?="\'()+-*/.{}[]#,&|!~<>'

function is_vaild_var (token){
    return REG_VARIABLE.test(token)
}

function is_vaild_number (token) {
    return REG_NUMBER.test(token)
}

function is_qt (chr) {
    return QUOT.indexOf(chr) != -1
}
//just use for node parse
function is_kw (chr) {
    return KEY_WORD_NODE.indexOf(chr) != -1
}

function is_meta (w) {
    return META.indexOf(w) != -1
}

function is_e_kw (chr) {
    return KEY_WORD_EXPRESSION.indexOf(chr) != -1
}

//compile and return ast
function compile (str) {

    const parser = new Parser(str, file)

    //pick a token
    const pt = (stop_at_space = true, ignore_fspace = true, kw = null) => 
                parser.pick_token(stop_at_space, ignore_fspace, kw)
    
    const st = (stop_at_space = true, ignore_fspace = true, kw = null) => 
                parser.seek_token(stop_at_space, ignore_fspace, kw)

    const pick = (ignore_space = true, ignore_breakline = true) =>
                parser.pick(ignore_space, ignore_breakline)

    const seek = (ignore_space = true, ignore_breakline = true) =>
                parser.seek(1, ignore_space, ignore_breakline)

    const err = (what) => parser.error(what)

    //pick string
    const ps = function (chr) {
        let t = pt(false, false, chr), buffer = [t]
        while (get_i(t, -1) == '\\' && get_i(t, -2) != '\\') {
            pick()
            t = pt(false, false, chr)
            buffer.push(chr, t)
        }
        return buffer.join('')
    }

    //pick expression and tokenize 
    const pe = function (end) {
        let buffer = [], token;
        while (true) {
            let k = seek(true, false)
            if (end.indexOf(k) != -1) {
                break
            } else if (is_qt(k)){
                pick()
                buffer.push(new TString(ps(k)))
                pick()
            } else if (k == '{'){
                pick()
                buffer.push(k)
                if (is_qt(seek())) continue
                buffer.push(new TString(pt(true, true, KEY_WORD_EXPRESSION)))
                if (seek() != ':') err()
            } else if (is_e_kw(k)) {
                pick()
                buffer.push(k)
            } else {
                token = pt(true, true, KEY_WORD_EXPRESSION)
                if (is_vaild_number(token))
                    buffer.push(new TNumber(token))
                else if (is_vaild_var(token))
                    buffer.push(new TVariable(token))
                else 
                    err()
            } 
        }
        return buffer
    }

    parser.set_kw(KEY_WORD_INCLUDE)

    //handle include
    let word = seek(), include_list = []
    while (word == '#') {
        pick()
        if (st(true, false) == 'include') {
            pt(true, false)
            if (seek(true, false) == '<') {
                pick(true, false)
                word = pt()
                if (seek(true, false) == '>') {
                    pick()
                    include_list.push(new IncludeMeta(word))
                    word = seek()
                    continue
                }
            }
            err()
        } else {
            err('unsupported meta')
        }
    }
    //end include

    let stack = [], current_scope = null
    stack.children = stack
    stack.push(stack)

    function handle_node (is_dnode = false) {
        let node, node_name, self_close = false
        pick() // escape '<'
        if (is_kw(seek())) err()
        node_name = word = pt()
        if (is_dnode) 
            node = new DNode(node_name)
        else 
            node = new ENode(node_name) 
        while(seek() != '>') {
            let chr = seek()
            if (chr == '/') {
                pick();
                self_close = true
                continue
            } else if (!is_kw(chr)) {
                word = pt()
                let chr = seek()
                if (chr == '=') {
                    pick()
                    let chr = seek()
                    if (is_qt(chr)) {
                        pick()
                        node.set_param(word, new TNode(ps(chr)))
                        pick()
                    } else if (chr == '#') {
                        pick()
                        node.set_param(word, new VNode(pe('#')))
                        pick()
                    } else if (!is_kw(chr)) {
                        let token = pt()
                        if (is_vaild_var(token))
                            node.set_param(word, new VNode([new TVariable(token)]))
                        else if (is_vaild_number(token))
                            node.set_param(word, new VNode([new TNumber(token)]))
                        else
                            err()
                    }
                    continue
                } else {
                    node.set_param(word)
                    continue
                }
            }
            err()
        }
        pick() //escape '>'
        if (current_scope !== null) current_scope.push(node)
        if (!self_close) {
            current_scope = node.children
            stack.push(node)
        }
        return node
    }

    function handle_meta () {
        let meta = st()
        if (meta == 'define') {
            pt()
            let field = st()
            if (is_vaild_var(field)) {
                pt()
                let def = new DefineMeta(field, new VNode(pe(Parser.LE)))
                current_scope.push(def)
                current_scope = def.children
                return
            }
        } else if (meta == 'for') {
            pt()
            let field = st(true, true, [','])
            if (is_vaild_var(field)) {
                pt(true, true, [','])
                if (seek() == ',') {
                    pick()
                    if (is_vaild_var(st()))
                        field = [field, pt()]
                    else
                        err()
                }
                if (st() == 'in') {
                    pt()
                    let f = new ForMeta(field, new VNode(pe(Parser.LE)))
                    current_scope.push(f)
                    current_scope = f.children
                    stack.push(f)
                    return
                }
            }
        } else if (meta == 'if') {
            pt()
            let i = new IfMeta(new VNode(pe(Parser.LE)))
            current_scope.push(i)
            current_scope = i.children
            stack.push(i)
            return    
        } else if (meta == 'else') {
            let i = get_i(stack, -1)
            if ('metaName' in i && i.metaName == 'if') {
                pt()
                i.add_branch()
                current_scope = i.children
                return
            } else {
                err('error else')
            }
        } else if (meta == 'elif') {
            let i = get_i(stack, -1)
            if ('metaName' in i && i.metaName == 'if') {
                pt()
                i.add_branch(new VNode(pe(Parser.LE)))
                current_scope = i.children
                return
            } else {
                err('error elif')
            }
        } else if (meta == 'endif') {
            let i = stack.pop()
            if ('metaName' in i && i.metaName == 'if') {
                pt()
                reset_current_scope()
                return
            } else {
                err('miss match endif')
            }            
        } else if (meta == 'endfor') {
            let f = stack.pop()
            if ('metaName' in f && f.metaName == 'for') {
                pt()
                reset_current_scope()
                return
            } else {
                err('miss match endfor')
            }        
        } else if (meta == 'include') {
            err('not allowed include')
        }
        err()
    }

    function reset_current_scope () {
        current_scope = get_i(stack, -1).children
    }

    //handle define
    let dnode = handle_node(true)
    //end define

    while (!parser.eof) {
        word = seek(false, false)
        if (word == '\\') {
            pick()
            current_scope.push(new TNode(pick(false, false)))
            continue
        } else if (word == '<') {
            parser.set_kw(KEY_WORD_NODE)
            if (parser.seek(2) != '/') {
                handle_node()
                continue
            } else {
                pick(); pick()
                word = pt()
                let node = stack.pop()
                if ('nodeName' in node && node.nodeName == word)
                    reset_current_scope()
                else
                    err('miss match ' + word)
                if (pick() == '>') continue
            }
        } else if (word == '#') {
            pick()
            parser.set_kw(KEY_WORD_NORMAL_META)
            if (is_meta(st())) {
                handle_meta()
                continue
            } else {
                current_scope.push(new VNode(pe('#')))
                pick()
                continue
            }
        } else {
            parser.set_kw(KEY_WORD_TEXT)
            word = pt(false, false)
            current_scope.push(new TNode(word))
            continue
        }
        err()
    }
    return [include_list, dnode]
}

module.exports = compile