# Pet Adoption Project - Automated Tests (Playwright)

This section will explain how to run the automated tests using the **Playwright** framework.

## Prerequisites

Before you run the tests, you need to have **Node.js** and **npm** installed on your system.

1. **Node.js**: Download and install the latest version of Node.js from [here](https://nodejs.org/).
2. **npm**: npm is the default package manager that comes with Node.js. Make sure it's installed by running:

`npm -v`

## Installation

### Step 1: Clone the repository

If you haven't already, clone the repository to your local machine:

`git clone https://github.com/gitta6/petAdoptionAutomated`

`cd petadoption_AutomatedTests`

### Step 2: Install dependencies

To install the required dependencies, run the following commands:


`npm install`

`npx playwright install`


### Step 3: Running the automated tests
Once the dependencies are installed, you can run the automated tests. To run the tests using 1 worker, use the following command:

`npx playwright test --workers=1 `

or

`npx playwright test <name of a specific test file>`

to run only a specific test file.

(Test cases can also be executed without using the terminal: simply open the test file and click on the green "play" icon that is placed on the left side of the test definition line!)

### Step 4: Viewing the test results

Once the tests are finished, Playwright will display the results in the terminal. 
Playwright also provides a HTML report that can be used for easier inspection of the test results:

`npx playwright show-report`
