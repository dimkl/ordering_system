function DropCustomProperties() {
  return {
    Schema: {
      leave(target) {
        delete target["$async"];
      }
    }
  };
}

// eslint-disable-next-line no-undef
module.exports = {
  id: "custom-props",
  decorators: {
    oas3: {
      "schema-drop-custom-props": DropCustomProperties
    }
  }
};
