import StateMachine from "javascript-state-machine";
import { OrderItemTransition } from "./orderItemTransition";

const FSM = StateMachine.factory({
  init: "draft",
  transitions: [
    { name: "place", from: "draft", to: "placed" },
    { name: "process", from: "placed", to: "processing" },
    { name: "deliver", from: "processing", to: "delivered" },
    { name: "requestPayment", from: "delivered", to: "payment_requested" },
    { name: "invoice", from: "payment_requested", to: "invoiced" },
    { name: "pay", from: "invoiced", to: "paid" },
    {
      name: "cancel",
      from: ["draft", "placed", "in_progress"],
      to: "canceled",
    },
    { name: "goto", from: "*", to: (s) => s },
  ],
  methods: {
    onTransition: (lifecycle, order) => {
      if (["goto", "init"].includes(lifecycle.transition)) {
        return true;
      }
      return order.$query().patch({ state: lifecycle.to });
    },
    onPlace: (lifecycle, order) => {
      return Promise.all(
        order.order_items.map((oi) =>
          OrderItemTransition.process(oi, order, "place")
        )
      );
    },
  },
});

export class OrderTransition {
  static async process(order, action) {
    const fsm = new FSM();
    await fsm.goto(order.state);

    await fsm[action](order);

    return order;
  }
}
