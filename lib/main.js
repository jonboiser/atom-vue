exports.activate = function() {
  if (!atom.grammars.addInjectionPoint) return;

  // Language injection for interpolated JS inside templates
  atom.grammars.addInjectionPoint("text.html.vue", {
    type: "interpolation",
    language(callExpression) {
      // Assuming that interpolated code can only be written in JS
      return "js";
    },

    content(callExpression) {
      return callExpression.children.find(node => node.type === "raw_text");
    }
  });

  // Language injection for interpolated JS inside directive arguments
  atom.grammars.addInjectionPoint("text.html.vue", {
    type: "directive_attribute",
    language(callExpression) {
      return "js";
    },

    content(callExpression) {
      const attrVal = callExpression.children.find(
        node => node.type === "quoted_attribute_value"
      );
      if (attrVal) {
        return attrVal.children.find(node => node.type === "attribute_value");
      }
    }
  });

  // Language injection for interpolated JS inside dynamic directive names
  atom.grammars.addInjectionPoint("text.html.vue", {
    type: "directive_dynamic_argument",
    language(callExpression) {
      return "js";
    },

    content(callExpression) {
      return callExpression.children.find(
        node => node.type === "directive_dynamic_argument_value"
      );
    }
  });

  const typeScriptRe = /lang=[\"\'](TS|ts|Ts)[\"\']/;

  // Language injection for JS inside <script> tag
  atom.grammars.addInjectionPoint("text.html.vue", {
    type: "script_element",
    language(callExpression) {
      // Assume only JS and TS, based on "lang" attribute
      // const startTag = callExpression.children.find(
      //   node => node.type === "start_tag"
      // );
      // console.log(startTag.text);
      // if (typeScriptRe.test(startTag.text)) {
      //   return "ts";
      // } else {
      //   return "js";
      // }
      // NOTE: language-typescript does not support language injection ATM
      return "js";
    },

    content(callExpression) {
      return callExpression.children.find(node => node.type === "raw_text");
    }
  });
};
