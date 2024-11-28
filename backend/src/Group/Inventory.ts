import {Elysia, error, t} from "elysia";
import {checkJWT} from "../Runtime/Auth";
import {Inventory} from "../Runtime/Inventory";
import {InventoryType} from "../../../common/Inventory";

export const inventoryGroup = new Elysia()
    .decorate('inventory', new Inventory())
    .group('/inventory', (app) => app
        .get('all', ({ inventory }) => inventory.get())
        // Guard of Admin Actions
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (permission === undefined) {
                        return error(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", "Admin", error)
                }
            },(app) => app
                .post('add', ({ inventory, body: { data }, error }) => {
                    return inventory.add(data);
                }, {
                    body: t.Object({
                        data: t.Object({
                            type: t.Enum(InventoryType),
                            isbn: t.String(),
                            author: t.String(),
                            title: t.String(),
                        })
                    })
                })
                .post('update', ({ inventory, body: { data }, error }) => {
                    inventory.update(data);
                }, {
                    body: t.Object({
                        data: t.Object({
                            title: t.String(),
                            type: t.Enum(InventoryType),
                            author: t.String(),
                            id: t.String(),
                            isbn: t.String(),
                            borrowed: t.Boolean(),
                            borrowedBy: t.String(),
                            expectReturnTime: t.String(),
                            reserved: t.Boolean(),
                            reservedBy: t.String(),
                        })
                    })
                })
        )
        // Guard of User Actions
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (permission === undefined) {
                        return error(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", "User", error)
                }
            },(app) => app
                .post('borrow', ({ inventory, cookie: { permission },body: { data }, error }) => {
                    try {
                        inventory.borrow(data, permission.toString());
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    body: t.Object({
                        data: t.Object({
                            id: t.String(),
                            expectReturnTime: t.String(),
                        })
                    })
                })
                .post('return', ({ inventory, cookie: { permission },body: { data }, error }) => {
                    try {
                        inventory.unBorrow(data, permission.toString());
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    body: t.Object({
                        data: t.Object({
                            id: t.String(),
                        })
                    })
                })
        )
    );