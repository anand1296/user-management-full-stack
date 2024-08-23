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

    const createUser = async (e: any) => {
        const {
            name: { value: name },
            email: { value: email },
        } = e.target;
        if (name && email) {
            console.log(name, email);
            try {
                const response = await axios.post(`${apiUrl}/api/users`, { name, email });
                setUsers((prevUsers) => [...prevUsers, response.data]);
                e.target.reset();
            } catch (error) {
                console.error("Error creating user:", error);
            }
        } else {
            console.error("Invalid user name or email");
        }
    };

    const updateUser = async (e: any, id: number) => {
        const {
            name: { value: name },
            email: { value: email },
        } = e.target;
        if (name && email) {
            try {
                const response = await axios.put(`${apiUrl}/api/users/${id}`, { name, email });
                setUsers(users.map((user) => (user.id === user.id ? response.data : user)));
                setEditableUser(null);
            } catch (error) {
                console.error("Error updating user:", error);
            }
        } else {
            console.error("Invalid user name or email");
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
        console.log(container);
        if (container) {
            container.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to the top
        }
    };

    //Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/users`);
                setUsers(response.data.reverse());
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [apiUrl]);

    return (
        <div className="w-full p-4 my-4 rounded shadow bg-cyan-500" ref={containerRef}>
            <div className="mb-6 flex items-center justify-around">
                <img src="/next.svg" alt="next-logo" className="w-20 h-20" />
                <img src="/go.svg" alt="go-logo" className="w-20 h-20" />
                <img src="/docker.svg" alt="go-logo" className="w-20 h-20" />
                <img src="/postgresql.svg" alt="go-logo" className="w-20 h-20" />
            </div>

            {/* Create user  */}
            <CreateUserForm editableUser={editableUser} createUser={createUser} updateUser={updateUser} />

            {/*Users list */}
            {users.map((user) => {
                const { id, name, email } = user;
                return (
                    <UserCard
                        key={id}
                        id={id}
                        name={name}
                        email={email}
                        editUser={() => setEditableUser(user)}
                        deleteUser={() => deleteUser(id)}
                    />
                );
            })}

            {/* mock user  */}
            <div key={1000}>
                <UserCard
                    id={1000}
                    name={"Mock"}
                    email={"mockuser@test.com"}
                    editUser={() => {
                        scrollToTop();
                        setEditableUser({ id: 1000, name: "Mock", email: "mockuser@test.com" });
                    }}
                    deleteUser={() => deleteUser(1000)}
                />
            </div>
        </div>
    );
};

export default UsersListPage;
