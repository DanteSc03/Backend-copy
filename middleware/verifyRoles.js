const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) {
            console.log('No roles found');
            return res.sendStatus(401);
        }

        const rolesArray = [...allowedRoles];
        const hasRole = rolesArray.some(role => allowedRoles.includes(role));

        if (!hasRole) {
            console.log('Role not allowed');
            return res.sendStatus(401);
        }

        next();
    };
};

module.exports = verifyRoles;
