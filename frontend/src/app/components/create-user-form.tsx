import { User } from "../pages/users-list";

type CreateUserFormProps = {
    editableUser: User | null;
    createUser: (e: any) => void;
    updateUser: (e: any, id: number) => void;
};

const CreateUserForm = ({ editableUser, createUser, updateUser }: CreateUserFormProps) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (editableUser) {
                    updateUser(e, editableUser.id);
                } else {
                    createUser(e);
                }
            }}
            className="max-w-lg rounded p-4 my-6 bg-blue-100 shadow mx-auto"
        >
            <h2 className="mb-4">{editableUser ? "Edit User" : "Create User"}</h2>
            {editableUser && (
                <input
                    readOnly
                    disabled
                    type="text"
                    className="p-2 mb-2 w-full border-gray-300 rounded"
                    name="id"
                    value={"ID: " + editableUser.id}
                />
            )}
            <input
                type="text"
                className="p-2 mb-2 w-full border-gray-300 rounded"
                placeholder="Name"
                name="name"
                value={editableUser?.name || ""}
                onChange={() => {}}
            />
            <input
                type="email"
                className="p-2 mb-2 w-full border-gray-300 rounded"
                placeholder="Email"
                name="email"
                value={editableUser?.email || ""}
                onChange={() => {}}
            />
            <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                Submit
            </button>
        </form>
    );
};

export default CreateUserForm;
