import React, { useState, useEffect, useRef } from 'react';
import { useUser, useAuth } from '../../../hooks';

export function UsersEstablishmentsAdmin() {

  let emptyUser = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    isActive: true,
    roles: [],
  };

  const { auth } = useAuth();
  const { users, loading, error, loadingCrud, getUsersAll, addUserAll, deleteUserAll, updateUserAll } = useUser();

  const [refreshTable, setRefreshTable] = useState(false);
  const [usersTable, setUsersTable] = useState(null);

  useEffect(() => {
    getUsersAll();
  }, [refreshTable, getUsersAll]);

  useEffect(() => {
    if (users) {
      const filteredUsers = users.filter(user => user.id !== auth.me.user.id);
      setUsersTable(filteredUsers);
    }
  }, [users, auth]);

  console.log(usersTable);

  const onRefresh = () => setRefreshTable((state) => !state);

  return (
    <div>UsersEstablishmentAdmin</div>
  )
}
