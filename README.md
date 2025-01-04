# Remo

## How to run

1. npm install
2. npm run dev
3. http://localhost:5173/

## Folder structure

```markup
├── public
├── src
│   ├── api                             service call and config
│   ├── components                      common components
│   ├── models                          models use in app
│   ├── pages                           all page entry
│   │   ├── abc
│   │   │   ├── index.tsx               barrel file for all page from one resource
│   │   │   ├── list
│   │   │   │   ├── index.tsx           entry file
│   │   │   │   ├── index.test.tsx      test file
│   │   │   ├── create
│   │   │   ├── edit
│   │   │   └── show
│   │   └── forgotPassword
│   ├── resources                       resources config for refine
│   ├── routes                          all routes in app
│   ├── tailwind.css                    global styles in application
├── Makefile                            script command
├── .env
```
