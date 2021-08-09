/*
 * @Author: myname
 * @Date: 2021-05-20 17:19:52
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-05-20 17:22:54
 */

let template = `
<ul>
  <% for(let i=0; i < data.supplies.length; i++) { %>
    <li><%= data.supplies[i] %></li>
  <% } %>
</ul>
`;
function compile(template) {
    const evalExpr = /<%=(.+?)%>/g;
    const expr = /<%([\s\S]+?)%>/g;

    template = template.replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`').replace(expr, '`); \n $1 \n  echo(`');

    template = 'echo(`' + template + '`);';
    console.log(template);
    let script = `(function parse(data){
        let output = "";

        function echo(html){
        output += html;
        }

        ${template}

        return output;
    })`;
    console.log(script);
    return script;
}
let parse = eval(compile(template));
console.dir(parse);
const ahtml = parse({supplies: ['broom', 'mop', 'cleaner']});
