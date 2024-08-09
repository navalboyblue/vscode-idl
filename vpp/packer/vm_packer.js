const Coder = require('./coder.js')

function vm_packer (files, ast, name) {
    function is_instance (file) {
        return files.indexOf(files) != -1      
    }
    const coder = new Coder()
    coder.add_line('function ' + name + '_vm () {')
    coder.indent()
    coder.add_line('return ', false)
    coder.add(ast.serialize(is_instance, coder._indent) + ';')
    coder.deindent()
    coder.add_newline()
    coder.add_line('}', false)
    return coder.toString()
}

module.exports = vm_packer