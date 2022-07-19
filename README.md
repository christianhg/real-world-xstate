# Real-World XState

A collection of real-world problems and how you can solve them with [XState](https://xstate.js.org/).

Feel free to contribute with examples ❤️

The examples don't have to be copy/paste from an existing project. In fact, they should probably be distilled to a proof of concept/demo version. The main purpose is to share knowledge and experiences with orchestrating logic using state machines and statecharts.

## Examples

### 🔔 Off-Screen Notification

On a page with a long-running process, we needed to show a notification to the user if the process finished off-screen. The result is a statechart that gets notified of the completion of the process as well as its visibility. The visibility is tracked using a spawned child machine that invokes an `IntersectionObserver`.

- 🧶 **Src**: [./src/examples/off-screen-notification](./src/examples/off-screen-notification)
- 🕹️ **Demo**: https://real-world-xstate.vercel.app/examples/off-screen-notification

## To-do

- [ ] Add more examples
- [ ] Scope the CSS for each example
- [ ] Create minimal landing page
