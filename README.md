# DPV - An Interactive Dynamic Programming Visualizer

This is a React SPA designed as a learning tool to teach dynamic programming


## Project Directory

This project is split into a `backend` and `frontend`.

The `backend` was written using `Python` and `Flask` and contains the files for the algorithms, the websocket and their tests.

The `frontend` was written using `JavaScript` using the `React` framework and contains the files for the components, `config` file and their tests.

The structure of the project is shown in the dropdown below.

```ultree
output: foldable
open: false
project_submission
├── README.md
├── backend
│   ├── __init__.py
│   ├── algorithms
│   │   ├── __init__.py
│   │   ├── fibonacci.py
│   │   ├── knapsack.py
│   │   └── lcs.py
│   ├── app.py
│   ├── requirements.txt
│   └── tests
│       ├── __init__.py
│       ├── test_app.py
│       ├── test_fibonacci.py
│       ├── test_knapsack.py
│       └── test_lcs.py
└── frontend
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── src
    │   ├── App.jsx
    │   ├── assets
    │   │   └── react.svg
    │   ├── components
    │   │   ├── codePanel.jsx
    │   │   ├── codeSnippets.jsx
    │   │   ├── controlPanel.jsx
    │   │   ├── infoPanel.jsx
    │   │   ├── playback.jsx
    │   │   └── visualisation.jsx
    │   ├── data
    │   │   └── config.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   └── tests
    │       ├── app.test.jsx
    │       ├── codePanel.test.jsx
    │       ├── controlPanel.test.jsx
    │       ├── infoPanel.test.jsx
    │       ├── playback.test.jsx
    │       ├── setupTests.js
    │       ├── tableVisualiser.test.jsx
    │       ├── treeVisualiser.test.jsx
    │       └── visualisation.test.jsx
    ├── tailwind.config.js
    └── vite.config.js

```

## Setup Instructions

### Setting up the Backend

Open a new terminal at the root of the project.

Set up a `Python` virtual environment from the root of the project:

```
$ virtualenv venv
$ source venv/bin/activate
```

Navigate to the `backend` directory:

```
(venv) $ cd backend
```

Install the required `python` libraries:

```
(venv) $ pip3 install -r requirements.txt
```

### Setting up the Frontend

In a second terminal navigate to the frontend directory:

```
$ cd frontend
```

Install the dependencies:

```
$ npm install
```

## Running the project

Open two terminals and navigate to the root of the project.

In the first terminal, start the `backend` server

```
(venv) $ python3 -m backend.app
```

In the second terminal, start the `frontend` server

```
$ npm run dev
```

Open any browser and navigate to `localhost:5173`
