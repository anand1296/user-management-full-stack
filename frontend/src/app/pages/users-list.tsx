"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import UserCard from "../components/user-card";
import CreateUserForm from "../components/create-user-form";

export type User = {
    id: number;
    name: string;
    email: string;
};

const UsersListPage = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const [users, setUsers] = useState<Array<User>>([]);
    const [editableUser, setEditableUser] = useState<User | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const createUser = async (user: { name: string; email: string }) => {
        try {
            const response = await axios.post(`${apiUrl}/api/users`, user);
            setUsers((prevUsers) => [response.data, ...prevUsers]);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const updateUser = async (user: { name: string; email: string }, id: number) => {
        try {
            const response = await axios.put(`${apiUrl}/api/users/${id}`, user);
            setUsers(users.map((_user) => (_user.id === id ? response.data : _user)));
            setEditableUser(null);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const deleteUser = async (id: number) => {
        try {
            await axios.delete(`${apiUrl}/api/users/${id}`);
            setUsers(users.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const scrollToTop = () => {
        const container = containerRef.current;
        if (container) {
            container.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    //Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/users`);
                console.log(response);
                setUsers(response.data.reverse());
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [apiUrl]);

    return (
        <div className="w-full p-4 my-4 rounded shadow bg-cyan-500">
            <div className="mb-6 flex items-center justify-around" ref={containerRef}>
                <img src="/next.svg" alt="next-logo" className="w-20 h-20" />
                <img src="/go.svg" alt="go-logo" className="w-20 h-20" />
                <img src="/docker.svg" alt="go-logo" className="w-20 h-20" />
                <img src="/postgresql.svg" alt="go-logo" className="w-20 h-20" />
            </div>

            {/* Create user  */}
            <CreateUserForm
                editableUser={editableUser}
                setEditableUser={setEditableUser}
                createUser={createUser}
                updateUser={updateUser}
            />

            {/*Users list */}
            {users.map((user) => {
                const { id, name, email } = user;
                return (
                    <UserCard
                        key={id}
                        id={id}
                        name={name}
                        email={email}
                        editUser={() => {
                            scrollToTop();
                            setEditableUser(user);
                        }}
                        deleteUser={() => deleteUser(id)}
                    />
                );
            })}
        </div>
    );
};

export default UsersListPage;
