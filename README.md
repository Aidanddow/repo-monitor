<div align="center">
<h1>Team Analyser</h1>
Team Analyser is an application that helps software team leaders/managers to evaluate the contributions made by team members to their projects. You can check out a deployed minimum viable product at <a href="http://13.232.126.97">http://13.232.126.97</a>.
</div>

## Getting Started
### **Prerequisites**
You need to have [Python](https://www.python.org/downloads/) (preferably version 3.10.x), [pip](https://pip.pypa.io/en/stable/installation/) (should be installed with Python), and [pipenv](https://pypi.org/project/pipenv/) installed on your machine. 

## Installation
If you just want to get the application up and running on your local machine, follow the steps below.

Now clone the project, install its dependencies and then run the development server.

1. `git clone https://github.com/najmathummer/Team-Evaluator.git`
2. `cd backend`
3. `pipenv install`
4. `pipenv shell`
5. `python manage.py makemigrations core`
6. `python manage.py migrate`
7. `python manage.py runserver` (substitute `python` with `python3` if you're running into issues)

## Building locally
If you would like to make changes to the source code and tinker with the project, read on to find out how to rebuild the application.<br>
There are two folders in the project root directory. `dev-evaluation` is the React code, while `backend` is, of course, the django source code.

**Back-end**<br>
The backend is ready to run as it is. Once you've made changes to the django project, simply run `python manage.py runserver [PORT]` to run the development webserver. The `PORT` argument is optional and defaults to 8000.

**Client-side**<br>
To set up the react codebase for modification:-
1. `cd dev-evaluation`
2. `npm install`
3. `npm start`

This will launch a development build of the front-end that should automatically launch in your browser.

Once you've finalised changes to the React app, you can build it and integrate the build with the Django app by running the script `integrate_script.sh` **from the project root**.