type UserCardProps = {
    id: number;
    name: string;
    email: string;
    editUser: () => void;
    deleteUser: () => void;
};

const UserCard = ({ id, name, email, editUser, deleteUser }: UserCardProps) => {
    return (
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-4 mb-2 flex items-center justify-between hover:bg-gray-100">
            <div className="flex flex-col">
                <div className="text-sm text-gray-600">ID: {id}</div>
                <div className="text-lg font-semibold text-gray-800">{name}</div>
                <div className="text-base text-gray-600">{email}</div>
            </div>

            {/* actions */}
            <div className="flex items-center justify-between gap-2">
                <button
                    type="button"
                    className="p-2 text-white bg-amber-500 rounded hover:bg-amber-600"
                    onClick={() => editUser()}
                >
                    Edit
                </button>
                <button
                    type="button"
                    className="p-2 text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => deleteUser()}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default UserCard;
