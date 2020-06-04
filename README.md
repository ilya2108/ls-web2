# Frontend tech stack

## CI/CD
gitlab + docker + gitlabCI/CD?

Alternatives:
- github + circleCI

---

## Framework
<span style="color: lightgreen;">React</span>
 - being a small library enables flexibility

Alternatives:

Vue.js
 - easy to write code in
 - would need to learn

<span style="color: orangered;">Angular</span>
 - robust enterprise framework
 - lengthens the development time

---

## Components and Style

3rd party - speeds up development
- Shards React - https://designrevision.com/docs/shards-react/getting-started
- Ant Design for React - https://ant.design/docs/react/introduce
- Rsuitejs - https://rsuitejs.com/
- Grommet - https://v2.grommet.io/
- Blueprint - https://blueprintjs.com/docs/
- Evergreen - https://evergreen.segment.com/
- Material UI - https://material-ui.com/
- Argon Design System React - https://www.creative-tim.com/product/argon-design-system-react/?partner=91096
- Rebassjs - https://rebassjs.org/

Custom style and components - enables perserving the original brand design of customer - the university 

---

## State management
Context API + GraphQL

- viable for a smallscale/simple application resulting in faster development

Apollo + GraphQL
- replaces Redux
- caches fetched data, and fetches only when data has been changed in the server database

---

## CSR vs SSR
<SSR style="color: lightgreen;">SSR - next.js</span>
 - prerendered sites -> lighter on clients
 - SSR usually delivers static sites to users
 - developing a dynamic client is possible with next.js (example: m.twitch.tv)

CSR - default
 - requires fetching the whole client package from servers
 - requires rendering on client
 - CSR offers a dynamic client usage experience

---

## Typed vs Dynamic Language
<span style="color: lightgreen;">Typescript</span>
- benefits of a typed language in development
- <span style="color: orangered;">typed components are a personal disadvantage for me</span>

Alternatives:

- Elm
- Flow
- ReasonML
- <span style="color: lightgreen;">ES6/7/8 Javscript</span>
    - dynamic -> faster development
    - possible unexpected behaviour, bug prone

---

## Testing
<span style="color: lightgreen;">Enzyme</span>
- for testing components

<Jest style="color: lightgreen;">Jest</span>
- ultimate testing framework, covers every aspect of unit testing: testing infrastructure for test running, assertion, mocking, coverage report

Jasmine + istanbul
- istanbul for coverage report, Jasmine for everything else

Mocha + chai + Sinon.js + istanbul
- Mocha as a testing infrastructure
- chai for assertion
- Sinon.js for mocking
- istanbul for coverage report

---

## Optimization
react-loadable
- code splitting

<span style="color: lightgreen;">PWA</span>
- take advantage of setup resources by create-react-app to add progressive web app capabilities