class Scope {}

class Define extends Scope{
    constructor (field, children) {
        super()
        this.field = field
        this.children = children
    }
}

class For extends Scope {
    constructor (field, obj, children) {
        super()
        this.field = field
        this.children = children
        this.obj = obj
    }
}

class ViewModel extends Scope {
    constructor (parameters, children) {
        super()
        if (children === undefined) {
            this.parameters = null
            children = parameters
        } else {
            this.parameters = parameters
        }
        this.children = children
    }
}

class Element {
    constructor (tagName, parameters, children) {
        if (children === undefined) {
            this.parameters = null
            children = parameters
        } else {
            this.parameters = parameters
        }
        this.children = children
        this.tagName = tagName
    }
}

class Value {
    constructor (valueFunc) {
        this.value = valueFunc
    }
}

class If {
    //[[codition1, [chidren1]], [condtion2, [children2]]]
    constructor (branch_list) {
        this.branchs = []
        for (let b of branch_list) {
            this.branchs.push(new If.Branch(b[0], b[1]))
        }
    }
}
If.Branch = function (condition, children) {
    this.condition = condition
    this.children = children
}