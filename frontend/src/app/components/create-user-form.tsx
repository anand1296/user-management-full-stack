import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { User } from "../pages/users-list";

type CreateUserFormProps = {
    editableUser: User | null;
    setEditableUser: Dispatch<SetStateAction<User | null>>;
    createUser: (data: FormData) => void;
    updateUser: (data: FormData, id: number) => void;
};

type FormData = {
    name: string;
    email: string;
};

const CreateUserForm = ({ editableUser, setEditableUser, createUser, updateUser }: CreateUserFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields, isValid },
    } = useForm<FormData>({
        defaultValues: {
            name: editableUser?.name || "",
            email: editableUser?.email || "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        reset({
            name: editableUser?.name || "",
            email: editableUser?.email || "",
        });
    }, [editableUser, reset]);

    const onSubmit: SubmitHandler<FormData> = (data) => {
        if (editableUser) {
            updateUser(data, editableUser.id);
        } else {
            createUser(data);
        }
        setEditableUser(null);
        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={`max-w-lg rounded p-4 my-6 bg-blue-100 shadow mx-auto ${
                editableUser && "border-2 border-blue-500"
            }`}
        >
            <h2 className="mb-4">{editableUser ? "Edit User" : "Create User"}</h2>
            {editableUser && (
                <input
                    readOnly
                    disabled
                    type="text"
                    className="p-2 mb-2 w-full border-gray-300 rounded"
                    value={"ID: " + editableUser.id}
                />
            )}
            <div className="mb-2">
                <input
                    type="text"
                    className="p-2 w-full border-gray-300 rounded"
                    placeholder="Name"
                    {...register("name", { required: "Name is required" })}
                />
                {dirtyFields.name && errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="mb-2">
                <input
                    type="email"
                    className="p-2 w-full border-gray-300 rounded"
                    placeholder="Email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                            message: "Invalid email address",
                        },
                    })}
                />
                {dirtyFields.email && errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="flex items-center justify-start gap-2">
                <button
                    type="submit"
                    className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isValid}
                >
                    {editableUser ? "Update" : "Create"}
                </button>
                <button
                    type="button"
                    className="p-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                    onClick={() => {
                        reset();
                        setEditableUser(null);
                    }}
                >
                    Reset
                </button>
            </div>
        </form>
    );
};

export default CreateUserForm;
