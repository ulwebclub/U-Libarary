import {Elysia, error, t} from "elysia";
import {checkJWT} from "../Runtime/Auth";
import {Inventory} from "../Runtime/Inventory";

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
                    return await checkJWT(permission.value || "", "admin", error)
                }
            },(app) => app

        )
        // Guard of User Actions
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (permission === undefined) {
                        return error(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", "user", error)
                }
            },(app) => app
                .post('borrow', ({ inventory, body: { data }, error }) => {
                    try {
                        inventory.borrow(data);
                        return inventory.get();
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    body: t.Object({
                        data: t.Object({
                            isbn: t.String(),
                            expectReturnTime: t.String(),
                        })
                    })
                })
        )
    );