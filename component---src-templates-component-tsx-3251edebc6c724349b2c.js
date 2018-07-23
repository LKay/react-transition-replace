(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{118:function(e,t,n){"use strict";var r=n(1),a=n.n(r),c=n(0),l=n.n(c),o=n(117),u=n.n(o);n.d(t,"a",function(){return u.a}),n(119),a.a.createContext({}),l.a.object,l.a.string.isRequired,l.a.func,l.a.func},119:function(e,t,n){var r;e.exports=(r=n(123))&&r.default||r},123:function(e,t,n){"use strict";n.r(t);var r=n(1),a=n.n(r),c=n(0),l=n.n(c),o=n(59),u=n(3),i=function(e){var t=e.location,n=u.a.getResourcesForPathname(t.pathname);return a.a.createElement(o.a,{location:t,pageResources:n})};i.propTypes={location:l.a.shape({pathname:l.a.string.isRequired}).isRequired},t.default=i},125:function(e,t,n){"use strict";n.d(t,"a",function(){return u});var r=n(32),a=n.n(r),c=n(1),l=n(118),o=n(130),u=(n(126),n(128),function(e){function t(){for(var t,n=arguments.length,r=new Array(n),a=0;a<n;a++)r[a]=arguments[a];return(t=e.call.apply(e,[this].concat(r))||this).state={isOpen:!1},t}return a()(t,e),t.prototype.render=function(){var e=this.props,t=e.data.site.siteMetadata.title,n=e.children;return c.createElement("div",null,c.createElement(o.e,{fixed:"top",dark:!0,color:"dark"},c.createElement(o.a,null,c.createElement(l.a,{to:"/",className:"navbar-brand mr-auto"},t),c.createElement(o.b,{navbar:!0},c.createElement(o.c,null,c.createElement(o.d,{href:"https://github.com/LKay/react-transition-replace"},c.createElement("i",{className:"fab fa-fw fa-github fa-lg"})))))),c.createElement(o.a,{style:{marginTop:"75px"}},n))},t}(c.Component))},126:function(e,t,n){},128:function(e,t,n){},227:function(e,t,n){"use strict";n.r(t),n.d(t,"query",function(){return f}),n(230);var r=n(32),a=n.n(r),c=(n(68),n(1)),l=n(118),o=n(251),u=n.n(o),i=n(125),s=function(e){return e.trim().replace(/^\{/,"").replace(/\}$/,"")},m=function(e){var t=e.description;return t&&t.childMarkdownRemark&&t.childMarkdownRemark.html},d=function(e){function t(){for(var t,n=arguments.length,r=new Array(n),a=0;a<n;a++)r[a]=arguments[a];return(t=e.call.apply(e,[this].concat(r))||this).renderProp=function(e,n){var r=e.defaultValue,a=e.name,l=e.required,o=t.renderType(e),u=n+"-prop-"+a;return c.createElement("section",{key:a},c.createElement("h3",{id:u,style:{marginTop:"1.5rem",marginBottom:"0.5rem"}},c.createElement("a",{href:"#"+u},c.createElement("code",null,a))),c.createElement("div",{dangerouslySetInnerHTML:{__html:m(e)}}),c.createElement("div",{style:{paddingLeft:0}},c.createElement("div",null,"type: ",o&&"pre"===o.type?o:c.createElement("code",null,o)),l&&c.createElement("div",null,"required"),r&&c.createElement("div",null,"default: ",c.createElement("code",null,r.value.trim()))))},t}a()(t,e);var n=t.prototype;return n.render=function(){var e=this,t=this.props,n=t.data,r=t.location,a=n.metadata;return n.site.siteMetadata.componentPages,c.createElement(i.a,{data:n,location:r},c.createElement("div",null,c.createElement("div",{className:"d-flex flex-row align-items-center mb-4"},c.createElement(l.a,{to:"/#Components",className:"btn btn-outline-dark"},c.createElement("i",{className:"fas fa-fw fa-arrow-left"})),c.createElement("h1",{id:a.displayName,className:"mb-0 ml-3"},a.displayName)),c.createElement("div",{dangerouslySetInnerHTML:{__html:m(a)}}),c.createElement("div",{className:"grid"},c.createElement("h2",null,c.createElement("div",null,"Props"),a.composes&&c.createElement("small",{style:{fontStyle:"italic",fontSize:"70%"}},"Accepts all props from"," ",a.composes.map(function(e){return"<"+e.replace("./","")+">"}).join(", ")," ","unless otherwise noted.")),a.props.map(function(t){return e.renderProp(t,a.displayName)}))))},n.renderType=function(e){var t,n=this,r=e.type||{},a=p(r.name),l=e.doclets||{};switch(a){case"node":return"any";case"function":return"Function";case"elementType":return"ReactClass<any>";case"dateFormat":return"string | (date: Date, culture: ?string, localizer: Localizer) => string";case"dateRangeFormat":return"(range: { start: Date, end: Date }, culture: ?string, localizer: Localizer) => string";case"object":case"Object":return r.value?c.createElement("pre",{className:"shape-prop"},(t=function e(t){return u()(t,function(t,n,r){t[n.required?r:r+"?"]=function t(n){var r=n.type||{},a=p(r.name),c=n.doclets||{};switch(a){case"node":return"any";case"function":return"Function";case"elementType":return"ReactClass<any>";case"object":case"Object":return r.value?e(r.value):a;case"array":case"Array":var l=t({type:r.value});return"Array<"+l+">";case"custom":return s(c.type||a);default:return a}}(n)},{})}(r.value),JSON.stringify(t,null,2).replace(/"|'/g,""))):a;case"union":return r.value.reduce(function(e,t,r,a){t="string"==typeof t?{name:t}:t;var l=n.renderType({type:t});return c.isValidElement(l)&&(l=c.cloneElement(l,{key:r})),e=e.concat(l),r===a.length-1?e:e.concat(" | ")},[]);case"array":case"Array":var o=this.renderType({type:r.value});return c.createElement("span",null,"Array<",o,">");case"enum":return this.renderEnum(r);case"custom":return s(l.type||a);default:return a}},n.renderEnum=function(e){var t=e.value||[];return c.createElement("code",null,t.join(" | "))},t}(c.Component);function p(e){return"func"===e?"function":"bool"===e?"boolean":"object"===e?"Object":e}var f="2265724363";t.default=d}}]);
//# sourceMappingURL=component---src-templates-component-tsx-3251edebc6c724349b2c.js.map