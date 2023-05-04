import StateMachine from "javascript-state-machine";

const FSM = StateMachine.factory({
  init: "draft",
  transitions: [
    { name: "place", from: "draft", to: "placed" },
    { name: "process", from: "placed", to: "prepared" },
    { name: "deliver", from: "prepared", to: "delivered" },
    { name: "cancel", from: ["draft", "placed"], to: "canceled" },
    { name: "goto", from: "*", to: (s) => s },
  ],
  methods: {
    onTransition: (lifecycle, orderItem, order) => {
      if (["goto", "init"].includes(lifecycle.transition)) {
        return true;
      }

      return orderItem.$query().patch({ state: lifecycle.to });
    },
    onProcess: (lifecycle, orderItem, order) => {
      if (order.state == "placed") {
        return order.$query().patch({ state: "processing" });
      }

      return true;
    },
    onDeliver: (lifecycle, orderItem, order) => {
      const allOrderItemsDelivered = order.order_items.every(
        (oi) => oi.state === "delivered"
      );
      if (order.state === "processing" && allOrderItemsDelivered) {
        return order.$query().patch({ state: "delivered" });
      }

      return true;
    },
  },
});

export class OrderItemTransition {
  static async process(orderItem, order, action) {
    const fsm = new FSM();
    await fsm.goto(orderItem.state);
    await fsm[action](orderItem, order);

    return order;
  }
}
