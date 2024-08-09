const { version } = require('../def.js')
const { VSyntaxError } = require('../error/error_static.js')

class Parser {
    constructor (str, file) {
        this.index = 0
        this.str = str
        this.endp = str.length
        this.linecode = 1
        this.lineindex = 0
        this.eof = (this.index > this.end)
        this.file = file
        this.doc = []
    }

    set_kw (kw) {//kw is an array-like
        this.kw = kw
    }

    save () {
        this.doc.push([this.index, this.linecode, this.lineindex, this.eof])
    }

    restore () {
        [this.index, this.linecode, this.lineindex, this.eof] = this.doc.pop()
    }

    pick (ignore_space = true, ignore_breakline = true) {
        if (this.eof)
            this.error("reach the end of the file")

        let ch = this.str[this.index]
        if (ch == '\r') {
            if (this.str[this.index + 1] == '\n') {
                ch = '\r\n'
                this.index++
            }
        }
        
        if (++this.index == this.endp)
            this.eof = true

        if (Parser.is_le(ch)) {
            this.lineindex = 0
            this.linecode++
            if (ignore_breakline) {
                return this.pick(ignore_space, ignore_breakline)
            }
        } else {
            this.lineindex++
            if (ignore_space && Parser.is_ep(ch)) {
                return this.pick(ignore_space, ignore_breakline)   
            }
        }
        return ch
    }

    seek (i = 1, ignore_space = true, ignore_breakline = true) {
        let ch
        this.save()
        while (i > 0) {
            i--
            ch = this.pick(ignore_space, ignore_breakline)
        }
        this.restore()
        return ch
    }

    pick_until (until) {
        let buffer = [], temp
        while (true) {
            try {
                temp = this.seek(1, false, false)
                if (until(temp)) break
                buffer.push(temp)
                this.pick(false, false)
            } catch (e) {
                if (buffer.length == 0) {
                    throw e
                } else {
                    break   
                }
            }
        }
        return buffer.join('')   
    }

    seek_until (until) {
        let word
        this.save()
        word = this.pick_until(until)
        this.restore()
        return word
    }

    pick_token (stop_at_space = true, ignore_fspace = true, kw = null) {
        if (ignore_fspace) this.skip_space()
        if (kw === null) kw = this.kw 
        return this.pick_until(function (chr) {
            return (stop_at_space ? Parser.is_ep(chr) : false) || kw.indexOf(chr) != -1  
        })
    }

    seek_token (stop_at_space = true, ignore_fspace = true, kw = null) {
        if (ignore_fspace) this.skip_space()
        if (kw === null) kw = this.kw
        return this.seek_until(function (chr) {
            return (stop_at_space ? Parser.is_ep(chr) : false) || kw.indexOf(chr) != -1  
        })
    }

    skip_space () {
        while (Parser.is_ep(this.seek(1, false, false)))
            this.pick(false, false)
    }

    error (what = 'unexpected token') {
        let temp = ['In ', this.file, ' ', this.linecode, ':', this.lineindex, ', '],
        index = this.index, front = 6
        temp.push(what)
        temp.push('\n\t')
        if (index > front)
            index = index - front
        else {
            index = 0
            front = index 
        }
        temp.push(JSON.stringify(this.str.slice(index, this.index)).slice(1, -1))
        if (!this.eof) temp.push(this.seek_token(true, false, ''))
        temp.push('\n\t')
        while (front--) {
            temp.push(' ')
        }
        temp.push('^')

        throw VSyntaxError(temp.join(''))
    }
}
Parser.LE = ['\r', '\n', '\r\n']
Parser.EP = /\s/
Parser.is_ep = function (chr) {
    return Parser.EP.test(chr)
}
Parser.is_le = function (chr) {
    return Parser.LE.indexOf(chr) != -1
}

module.exports = Parser