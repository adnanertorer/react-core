export const DrawerFormType = {
    ADD: "ADD",
    EDIT: "EDIT"
}  as const;

export type DrawerFormType = keyof typeof DrawerFormType;