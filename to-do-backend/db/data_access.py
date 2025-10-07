import pymysql

class DataAccess:
    def __init__(self):
        self.__connection = None
        self.__cursor = None
        self._connect()

    def _connect(self):
        if not self.__connection or not self.__connection.open:
            try:
                self.__connection = pymysql.connect(
                    host="localhost",
                    user="root",
                    db="todo_backend",
                    password="password",
                    cursorclass=pymysql.cursors.DictCursor,
                )
                self.__cursor = self.__connection.cursor()
            except pymysql.MySQLError as e:
                raise RuntimeError(f'Database connection error: {e}')

    def __del__(self):
        self.close()

    def close(self):
        if self.__cursor:
            try:
                self.__cursor.close()
            except pymysql.MySQLError:
                pass

        if self.__connection:
            try:
                self.__connection.close()
            except pymysql.MySQLError:
                pass

    def query(self, query, params=None):
        try:
            self._connect()
            self.__cursor.execute(query, params)
            return self.__cursor.fetchall()
        except pymysql.MySQLError as e:
            raise RuntimeError(f'Database query error: {e}')

    def execute(self, query, params=None):
        try:
            self._connect()
            self.__cursor.execute(query, params)
            self.__connection.commit()
        except pymysql.MySQLError as e:
            self.__connection.rollback()
            raise RuntimeError(f"Database query execution failed: {e}")