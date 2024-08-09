const  { NotImplement } = require('../def.js')
const { Meta } = require('./meta.js')
const { TString, TNumber, TVariable } = require('./expression.js')
const Coder = require('../packer/coder.js')

class Node {
    pack () { throw NotImplement('pack[func] in ' + this.constructor.name) }
    serialize () { throw NotImplement ('serialize[func] in ' + this.constructor.name)}
}

Node.ELEMENT_NODE = 1
Node.VALUEABLE_NODE = 2
Node.TEXT_NODE = 3
Node.DEFINITION_NODE = 4

//definition node
class DNode extends Node {
    constructor (name) {
        super()
        this.nodeType = Node.DEFINITION_NODE
        this.children = []
        this.parameters = {}
        this.nodeName = name
    }

    set_param (name, default_value = null) {
        this.parameters[name] = default_value
    }

    serialize (is_instance, indent) {
        let coder = new Coder(indent),
        has_param = Object.keys(this.parameters).length != 0,
        has_children = this.children.length != 0
        coder.add('new ViewModel(')

        if (has_param) {
            coder.add('{')
            let first = true
            for (let param in this.parameters) {
                let v = this.parameters[param]
                if (first) first = false
                else coder.add(',')
                coder.add_newline()    
                coder.add_line(param + ': ', false)
                coder.add(v.serialize())
            }
            coder.add_newline()
            coder.add_line('}', false)            
        }

        if (has_children) {
            if (has_param) coder.add(', ')
            coder.add('[')
            let first = true
            for (let child of this.children) {
                if (first) first = false
                else coder.add(',')
                coder.add_newline()
                coder.add_line(child.serialize(is_instance, indent), false)
            }
            coder.add_newline()
            coder.add_line(']', false)
        }

        coder.add(')')

        return coder.toString()
    }
}

//element node
class ENode extends Node {
    constructor (name) {
        super()
        this.nodeType = Node.ELEMENT_NODE
        this.children = []
        this.nodeName = name
        this.attributes = {}
    }

    set_param (name, value = null) {
        this.attributes[name] = value
    }

    serialize (is_instance, indent) {
        let coder = new Coder(indent),
        has_attr = Object.keys(this.attributes).length != 0,
        has_children = this.children.length != 0

        if (is_instance(this.nodeName)) {
            coder.add('new ' + this.nodeName + '_f(', false)
        } else {
            coder.add('new Element("' + this.nodeName + '"', false)
            if (has_attr || has_children) coder.add(', ')  
        }

        if (has_attr) {
            coder.add('{')
            let first = true
            for (let attr in this.attributes) {
                let v = this.attributes[attr]
                if (first) first = false
                else coder.add(',')
                coder.add_newline()    
                coder.add_line(attr + ': ', false)
                coder.add(v.serialize())
            }
            coder.add_newline()
            coder.add_line('}', false)            
        }

        if (has_children) {
            if (has_attr) coder.add(', ')
            coder.add('[')
            let first = true
            for (let child of this.children) {
                if (first) first = false
                else coder.add(',')
                coder.add_newline()
                coder.add_line(child.serialize(is_instance, indent), false)
            }
            coder.add_newline()
            coder.add_line(']', false)
        }

        coder.add(')')

        return coder.toString()
    }
}

//text node 
class TNode extends Node {
    constructor (text) {
        super()
        this.nodeType = Node.TEXT_NODE
        this.text = text
    }
    //place_holder is just a place holder ^v^
    serialize (place_holder, indent = 0) {
        let coder = new Coder(indent)
        coder.add(this.text)
        return JSON.stringify(coder.toString())
    }
}

//valueable node
class VNode extends Node {
    constructor (tokens) {
        super()
        this.nodeType = Node.VALUEABLE_NODE
        this.tokens = tokens
    }

    //place_holder is just a place holder ^v^
    serialize (place_holder, indent = 0) {
        let coder = new Coder(indent)
        coder.add('new Value(function(){return ')
        for (let token of this.tokens) {
            if (token instanceof TVariable ||
                token instanceof TString ||
                token instanceof TNumber)
                token = token.serialize()
            coder.add(token)
        }
        coder.add(';})')
        return coder.toString()
    }
}

module.exports = { DNode, TNode, VNode, ENode }