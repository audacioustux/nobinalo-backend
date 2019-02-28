module.exports = {
  up: ({ queryInterface }) => queryInterface.bulkInsert(
    'Users',
    [
      {
        handle: 'audacioustux',
        fullName: 'Tanjim Hossain',
        password: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: ({ queryInterface }) => queryInterface.bulkDelete('Users', null, {}),
};
