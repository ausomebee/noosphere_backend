export function hasPermission(user, permission) {
    if (!user) return false;
    if (user.type === "ADMIN" && user.superAdmin) return true;
    return Array.isArray(user.permissions) && user.permissions.includes(permission);
}

export function requirePermission(user, permission) {
    return hasPermission(user, permission);
}
