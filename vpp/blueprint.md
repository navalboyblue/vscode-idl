####list.v
```
#include <B>
<list list_data max_num>
    #for i in getlist()
        <B name = i[0]
           value = i[1]/>
    #endfor

    hello #name#!

    <B name = name|| name = #name/>
    <B name = name>Hello</B>
</list>
```
####list.js
```
class list {
    constructor () {
        this.name = 1
    }
    getlist () {
        return this.argv['list_data'].slice(this.argv['max_num'])
    }
    did_unload () {

    }
    did_load () {

    }
}
```

```
view中支持的指令
#include
#for #endfor
#if #elif #else #endif

js 
life cycle
did_load 加载完成后
did_unload 卸载的时候调用
```

```
Meta元节点
1. #inlcude
eg:
#include <A>

2. #for
eg:
#for k,v in obj
#endfor

3. #if
#if condition
#elif condtion
#else 
#endif

4. #define
#define A expression

Node节点
DNode  dom节点
SNode  字符串节点
VNode  变量节点
```

###after compile
```
//module_name.vc
================================
class_t date : 2016-12-10
view_t date : 2016-12-10
include: A, B, C
================================
const module_name =
{   
    init: function () {
        let class_t = 
        let instance = new
        return 
    },
    class_t: ,
}
```

#f()#
#a ? 1 : 2#
#a +-*/ 1#
#"\""#

expression

scope

get = function (name) {
   let scope = this.scope 
   while (scope !== null)
        if (scope.has(name)) {
            return scope.value(name)        
            break
        }
        scope = scope.scope     
}

//hard code
value = function () {
    this.get('v') ? 1 : 2
||  this.get('v') +-*/ 1
||  {a: this.get('v')}
||  "\""
||  [this.get('v')]
}