//正则表达式的声明
//1.使用字面量
var reg = /\bis\b/g;
//2.使用对象实例化
var reg = new RegExp('\\bis\\b','g');


/**
 * 修饰符
 *  g:global 全文搜索，不添加，匹配到第一个就停止
 *  i:ignore case 忽略大小写，默认大小写敏感
 *  m: mutilple lines 多行搜索
 */

 /**
  * 元字符
  * 正则表达式由两种基本字符类型组成
  * 1.原义文本字符:代表文本原来意思的文本字符
  * 2.元字符:在正则表达是有特殊含义的非字母字符 .*+?$^$......
  * 
  * \t 水平制表符
  * \v 垂直制表符
  * \n 换行符
  * \r 回车符
  * \0 空字符
  * \f 换页符
  * \c X与X对应的控制字符(Ctrl + X)
  */

  /**
   * 字符类
   * 一般情况下，正则表达式一个字符对应字符串的一个字符 但有时我们喜欢匹配的不是一个字符而是一类字符
   * 我们可以使用元字符[]来构建一个简单的类
   * 所谓类是指符合某些特性的对象，一个泛指，而不是特指某个字符
   * 表达式[abc]把字符a/b/c归为一个类，表达式可以匹配这类字符
   */
    var str = 'a1b2c3d4';
    str.replace(/[abc]/g,'X'); //X1X2X3d4

    /**
     * 字符类取反
     * 使用元字符^创建 反向类/负向泪
     * 反向类的意思是不属于某类的内容
     * 表达式[^abc]表示想匹配不是a/b/c的内容
     */

    var str = 'a1b2c3d4';
    str.replace(/[^abc]/g,'X'); //aXbXcXXX

    /**
     * 范围类
     * 使用字符类匹配数组[0123456789] 使用起来很麻烦
     * 所以可以使用[a-z]来连接两个字符 表示从a-z的任意字符
     * 这是一个闭区间，也就是包含a和z本身
     * 在[]组成的类内部是可以连写的 比如匹配所有字符[a-zA-Z]
     * 这里-是代表连接字符使用的 如果想匹配-字符串 需要再加上-[0-9-];
     */
    var str = 'a1b2d3x4z9';
    str.replace(/a-z/g,'Q');//Q1Q2Q3Q4Q9
    var str = 'a1B2C3D4';
    str.replace(/a-z/g,'Q');//Q1Q2Q3Q4
    var str = '2020-04-23';
    str.replace(/[0-9]/g,'A');//AAAA-AA-AA
    var str = '2020-04-23';
    str.replace(/[0-9-]/g,'A');//AAAAAAAAAA

    /**
     * 预定义类
     * 正则表达式提供预定义类，用来匹配常见的字符类
     * . 除了回车符合换行符之外的所有字符 [^\r\n]
     * \d 数字字符 [0-9]
     * \D 非数字字符 [^0-9]
     * \s 空白符 [\t\n\x0B\f\r]
     * \S 非空白符 [^\t\n\x0B\f\r]
     * \w 单词字符(数字、字母、下划线) [a-zA-Z_0-9]
     * \W 非单词字符 [^a-zA-Z_0-9]
     */

     //匹配一个ab + 数字 + 任意字符 的字符串
     var reg1 = /ab[0-9][^\r\n]/;
     var reg2 = /ab\d./;


     /**
      * 边界
      * 正则表达式提供了几个常用的边界匹配字符
      * ^ 以xxxx开头 (不是在[]中不是取反了哦)
      * $ 以xxxx结尾
      * \b 单词边界
      * \B 非单词边界
      */

     var str = 'This is a boy';
     str.replace(/is/g,'0');//th0 0 a boy; 这里会匹配到所有的is
     str.replace(/\bis\b/g,'0');//this 0 a boy 这里会匹配到前后有空格的is
     str.replace(/\Bis\b/g,'0');//th0 is a boy 这里会匹配到后面有空格的is

     var str = '@123@abc@';
     str.replace(/@./g,'Q');//Q23Qbc@ 这里会匹配到所有@+一个任意字符
     str.replace(/^@./g,'Q');//Q23@abc@ 这里只会匹配到@+一个任意字符开头的字符
     str.replace(/.@$/g,'Q');//Q23@abc@ 这里只会匹配到 一个任意字符 + @结尾的字符

     var str = `@123
                @456
                @789
             `;
    str.replace(/^@/g,'$');//这里只会匹配到@123中的@ 其他不会被匹配 因为换行开头的不会被当作字符串的开头
    str.replace(/^@/gm,'$');//定义了m多行匹配 这里就会匹配到所有的@

    /**
     * 量词
     * 如果我们希望匹配一个连续出现20次的数字字符串 我们需要 \d 20次 
     * 于是正则表达式提供了一系列的量词用来匹配字符出现的次数
     * {n} 出现n次
     * {n,m} 出现n-m次
     * {n,} 至少出现n次
     * ? 匹配0次或者1次(最多出现1次) {0,1}
     * + 出现1次或者多次(至少出现1次) {1,}
     * * 出现0次或者多次(任意次) {0,}
     */

     /**
      * 贪婪模式/非贪婪模式
      * 
      * 正则表达式默认会尽可能多的匹配符合条件的字符 默认就是贪婪模式
      * 
      * 非贪婪模式 就是我们手动设置 让正则表达式尽可能少的匹配，也就是说一旦匹配成功就不再继续尝试
      * 在量词后面加上? 就是非贪婪模式
      * 
      */
     '12345678'.replace(/\d{3,6}/g,'X'); //X78 贪婪模式
     '12345678'.replace(/\d{3,6}?/g,'X'); //XX78 非贪婪模式


     /**
      * 分组
      * 匹配字符串Byron联系出现3次的场景
      * Bryon{3} 此时其实只想匹配 Bruonnn 匹配n字符3次
      * 使用()可以达到分组的功能，使量词作用于分组
      * (Bryon){3}
      */

      var str = 'a1b2c3d4';
      str.replace(/[a-z]\d{3}/g,'X');//a1b2c3d4 此时会匹配一个小写字母后面跟3个数字的情况 是匹配不到的
      str.replace(/([a-z]\d{3})/g,'X');//Xd4 此时匹配的是一个小写字母加1个数字 连续出现3次

      /**
       * 或
       * 使用|可以达到或的效果
       * Byron|Casper 此时Byron或者Casper都会被匹配
       * Byr(on|Ca)sper
       */
      var str = 'ByronCasper';
      str.replace(/Byron|Casper/g,'X');//XX
      var str = 'ByronsperByrCasper'
      str.replace(/Byr(on|Ca)sper/g,'X');//XX


      /**
       * 反向引用
       * 2020-04-20 => 20/04/2020
       * 使用()进行捕获 放在$1,$2,$3...$n中 
       */
      var str = "2020-04-30";
      var newStr = str.replace(/(\d{4})-(\d{2})-(\d{2})/,'$2/$3/$1'); //04/30/2020

      /**
       * 忽略分组
       * 我们知道()是用来进行分组的 分组就会被捕获
       * 有时我们仅仅是想分组 而不需要被捕获 此时使用?:就可以进行忽略
       */
      var str = 'Byron,ok'
      str.replace(/(?:Byron).(ok)/,'$1'); //此时的$1是ok 而不是Bryon


      /**
       * 前瞻/后顾
       * 正则表达式是从文本头部向文本尾部开始解析，所以文本尾部方向称为“前”
       * 前瞻就是在正则表达式匹配到规则的时候，向前检查是否符合断言，后顾方向相反
       * js不支持后顾
       * 符合和不符合特定断言称为 肯定/正向匹配 和 否定/负向匹配
       * 
       * 正向前瞻exp(?=assert) 字符串符合正则表达式还不行 还要看后面符不符合断言部分(断言部分也是一个正则)
       * 负向前瞻exp(?!assert) 
       * 正向后顾exp(?<=assert) js不支持
       * 负向后顾exp(?<!assert) js不支持
       * 
       */

      //这里有一个概念 前瞻断言部分是一个正则 我们先匹配非断言部分 如果符合 就继续向后看 看后面的字符是否符合断言部分的正则。
      //这里我们匹配到的字符其实只是非断言部分的字符 断言部分只是用来判断 不用来匹配 下面是例子
      'a1b2cc'.replace(/[a-z](?=\d)/g,'A');//A1A2cc 这里我们只替换了 是a-z且后面一个字符是数字的字符 断言部分的(?=\d) 即数字部分 并没有被替换 因为他不会被匹配
      //负向前瞻
      'a1b2cc'.replace(/[a-z](?!\d)/,'A');//a1b2Ac 这里匹配的是a-z且后面字符不是数字的字符

      /**
       * 正则表达式对象属性(以下属性是只读的,只有在创建正则表达式对象的时候设置)
       * global: 是否全文搜索 默认false
       * ignore case 是否大小写敏感 默认false
       * multiline： 多行搜索 默认false
       * laseIndex: 是当前表达式匹配内容的最后一个字符的下一个位置
       * 我们用正则表达式匹配一个字符串的时候 可能会出现匹配到多个符合的结果 
       * 我们在匹配到某个结果的时候 会将lastIndex设置到 当前匹配结果的 最后一个字符的 下一个字符的下标
       * source:正则表达式的文本字符串
       */


       /**
        * 正则表达式对象的test方法
        * 用于测试字符串中是否存在匹配正则表达式模式的字符串 有就返回true 没有返回false
        */

        var reg1 = /\w/;
        var reg2 = /\w/g;

        //不适用全局
        reg1.test('a');//true
        reg1.test('$');//false
        //使用全局
        reg2.test('a');//true
        teg2.test('a');//false
        //思考：为什么第一次是true 第二次就变成false了呢？
        //其实这是lastIndex的原因 使用全局的话 test会将结果作用到正则表达式实例本身 将匹配到字符串的下标 重新赋值了正则表达式实例的lastIndex属性上
        reg.test('a');//true
        //第三次又变成了true呢？因为如果test为false的情况下 会将正则表达式实例的lastIndex属性重置为0
        //解决方案:用实例去执行
        /\w/.test('a');
        //但是这样每次都会去实例化正则表达式对象 造成内存损耗
        //其实我们使用test的方法只是想去知道字符串是否有符合正则表达式模式的字符串 不关心其他的 所以一般不要加g参数
        //如果我们不但需要知道字符串中是否有符合正则表达式模式的字符串 还要知道该字符串的下标位置时 可以考虑使用exec方法

        /**
         * 正则表达式对象的exec方法
         * 使用正则表达式模式对字符串执行搜索，并将更新全局RegExp对象的属性以反应结果
         * 如果没有匹配到结果返回null 匹配到就返回一个结果数组：
         * -index 声明匹配文本的第一个字符的位置
         * -input 存放被检索的字符串string
         * 
         * 非全局调用：
         * 调用非全局的RegExp对象的exec方法时，返回数组
         * 第一个元素是与正则表达式相匹配的文本
         * 第二个元素是与RegExpObject的第一个表达式相匹配的文本(如果有的话)
         * ....
         * 第n个元素与RegExpObject的第n个表达式匹配的文本
         */
        var reg1 =  /\d(\w)\d/;
        var reg2 =  /\d(\w)\d/g;
        var str = '$1a2b3c4d53'; 
        //执行1次 非全局
        reg1.exec(str); // ["1a2", "a", index: 1, input: "1a2b3c4d53", groups: undefined]
        console.log(reg1.lastIndex);//0
        //执行2次 非全局
        reg1.exec(str); // ["1a2", "a", index: 1, input: "1a2b3c4d53", groups: undefined]
        console.log(reg1.lastIndex);//0
        //执行1次 全局
        reg2.exec(str); // ["1a2", "a", index: 1, input: "1a2b3c4d53", groups: undefined]
        console.log(reg2.lastIndex);//4
        //执行2次 全局
        reg2.exec(str);// ["3c4", "c", index: 4, input: "1a2b3c4d53", groups: undefined]
        console.log(reg2.lastIndex);//7
       

        var reg3 =  /\d(\w)\d/g;
        var ret;
        while(ret = reg3.exec(str)) {
            console.log(ret);
        }
        //["1a2", "a", index: 0, input: "1a2b3c4d53", groups: undefined]
        //["3c4", "c", index: 4, input: "1a2b3c4d53", groups: undefined]

        /**
         * 字符串对象的search方法
         * 用于检索字符串中指定的子字符串，或检索与正则表达式想匹配的子字符串
         * 返回一个匹配的index 没有就返回-1
         * 该方法不执行全局匹配，它将忽略g，并且总是从字符串的0下标开始进行检索
         */
        //如果传入了非字符串也非正则的参数进行调用时 search会尝试将参数包装成RegExp对象 一下三种调用都可以
        'a1b2c3'.search(1);
        'a1b2c3'.search('1');
        'a1b2c3'.search(/1/);

        /**
         * 字符串对象的match方法
         * match方法将检索字符串，以找到一个或多个与RegExp匹配的文本
         * RegExp是否具有g修饰符，对结果影响很大
         * 
         * 非全局
         * 如果RegExp没有标志g，那么match方法就可能在字符串中执行一次匹配
         * 如果没有找到任何匹配文本，返回null
         * 如果找到了，就返回一个数组，该数组与RegExp.exec方法返回的数组一样
         * 
         * 全局调用
         * 如果RegExp具有标志g则match方法将执行全局搜索
         * 没有找到任何匹配，返回null
         * 如果找到一个或者多个匹配字符串，则返回数组。
         * 改数组中存放着字符串中所有的匹配子字符串，改数组没有index属性和input属性。
         */
        
         /**
          * 字符串的replace方法
          * String.prototype.replace(str,replaceStr)
          * String.prototype.replace(reg,replaceStr)
          * String.prototype.replace(reg,function)
          * 
          * 如果第二个参数是一个function 它接收四个参数
          * 1.匹配字符串
          * 2.正则表达式分组的内容，没有分组则没有该参数
          * 3.匹配项在字符串中的index
          * 4.原字符串
          */