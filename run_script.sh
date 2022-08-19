#!/bin/bash

cd backend
pipenv shell
# pipenv install
python3 manage.py runserver
