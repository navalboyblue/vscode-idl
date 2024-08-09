class Coder {
    constructor (indent = 0) {
        this.lineNumber = 1
        this._indent = indent
        this.buffer = []
    }

    add (str) {
        this.buffer.push(str)        
    }

    add_section () {
        let coder = new Coder(this._indent)
        this.buffer.push(coder)
        return coder
    }

    add_line (str, auto_linefeed = true) {
        this.buffer.push(Coder.INDENT_CHARACTER.repeat(this._indent * Coder.INDENT_LEVEL) 
            + str)
        if (auto_linefeed) this.add_newline()
    }

    add_newline () {
        this.buffer.push(Coder.LE)
        this.lineNumber++
    }

    indent () {
        this._indent++
    }
    
    deindent () {
        this._indent--
    }

    toString () {
        let result = []
        for (let i in this.buffer) {
            if (i instanceof Coder)
                result.push(i.toString())
            else
                result.push(i)
        }
        return result.join('')
    }
}

Coder.LE = '\n'
Coder.INDENT_CHARACTER = ' '
Coder.INDENT_LEVEL = 4

//module.exports= Coder
export default Coder