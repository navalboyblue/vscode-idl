#include <../A>
<sample n = #[1, 2, 3]# >
    # !(i > 1) ? "Hi, come here" : "Hi, see you agin"#
    <div onClick = b_click></div>
    #define a [1,2,3]
    #for i in n
        <A date = '2016-12-10' id = i/>
    #endfor
    #if 1
        <A/>
    #elif 2
        <B/>
    #else
    #endif
</sample>