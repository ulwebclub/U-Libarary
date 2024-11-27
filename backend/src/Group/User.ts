import {Elysia, error, t} from "elysia";
import {checkJWT} from "../Runtime/Auth";
import {User} from "../Runtime/User";
import {UserRole} from "../../../common/User";

export const userGroup = new Elysia()
    .decorate('user', new User())
    .group('/user', (app) => app
        // Guard of Admin Actions
        .guard(
            {
                async beforeHandle ({cookie: { permission }}) {
                    if (permission === undefined) {
                        return error(401, "Unauthorized");
                    }
                    return await checkJWT(permission.value || "", "admin", error)
                }
            }, (app) => app
                .get('', ({ user }) => user.get())
                .post('update', ({ user, body: { data }, error }) => {
                    try {
                        user.update(data);
                        return user.get();
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    body: t.Object({
                        data: t.Object({
                            id: t.String(),
                            username: t.String(),
                            email: t.String(),
                            password: t.String(),
                            role: t.Enum(UserRole)
                        })
                    })
                })
                .post('add', ({ user, body: { data }, error }) => {
                    try {
                        user.add(data);
                        return user.get();
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    body: t.Object({
                        data: t.Object({
                            id: t.String(),
                            username: t.String(),
                            email: t.String(),
                            password: t.String(),
                            role: t.Enum(UserRole)
                        })
                    })
                })
                .delete('delete/:id', ({ user, params: { id }, error }) => {
                    try {
                        user.delete(decodeURI(id));
                        return user.get();
                    } catch (e) {
                        return error(406, e);
                    }
                }, {
                    params: t.Object({
                        id: t.String()
                    })
                })
        )
    );