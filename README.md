# Real-World XState

A collection of real-world problems, and how you can solve them with [XState](https://xstate.js.org/).

Feel free to contribute with examples ❤️

## Examples

### 🔔 Off-Screen Notification

On a page with a long-running process, we needed to show a notification to the user if the process finished off-screen. The result is a statechart that gets notified of the completion of the process as well as its visibility.

- 🧶 **Src**: [./src/examples/off-screen-notification](./src/examples/off-screen-notification)
- 🕹️ **Demo**: https://real-world-xstate.vercel.app/examples/off-screen-notification
