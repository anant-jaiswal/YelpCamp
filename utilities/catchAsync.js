module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

//This returns a function, that accepts a function, executes the function and catches any error and then passes it to next (if there's any error)