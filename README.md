# Real-World XState

A collection of real-world problems and how you can solve them with [XState](https://xstate.js.org/).

Feel free to contribute with examples ❤️

The examples don't have to be copy/paste from an existing project. In fact, they should probably be distilled to a proof of concept/demo version. The main purpose is to share knowledge and experiences with orchestrating logic using state machines and statecharts.

You might also be interested in [xstate-catalogue.com](https://xstate-catalogue.com/) for a more official and generic collection of examples.

## Examples

### 💬 Collecting Feedback

A pure-UI feedback form driven by a state machine.

- 🧶 **Src**: [./src/examples/feedback](./src/examples/feedback)
- 🕹️ **Demo**: https://real-world-xstate.vercel.app/examples/feedback

### 🔔 Off-Screen Notification

On a page with a long-running process, we needed to show a notification to the user if the process finished off-screen. The result is a statechart that gets notified of the completion of the process as well as its visibility. The visibility is tracked using a spawned child machine that invokes an `IntersectionObserver`.

- 🧶 **Src**: [./src/examples/off-screen-notification](./src/examples/off-screen-notification)
- 🕹️ **Demo**: https://real-world-xstate.vercel.app/examples/off-screen-notification

## Development

Prerequisites:

- `node`: https://nodejs.org/
- `pnpm`: https://pnpm.io/

Run the app locally on http://localhost:5173/

```
pnpm dev
```

Run Storybook on http://localhost:6006/

```
pnpm storybook
```

## To-do

- [ ] Add more examples
- [ ] Scope the CSS for each example
- [x] Create minimal landing page
