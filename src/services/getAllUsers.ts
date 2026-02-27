import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Типизируем данные (если используешь TypeScript)
interface UserData {
  id: string;
  email?: string;
  role?: string;
  displayName?: string;
}

export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const colRef = collection(db, "users"); // Проверь имя здесь!
    const querySnapshot = await getDocs(colRef);

    console.log("Кол-во документов:", querySnapshot.size);

    if (querySnapshot.empty) {
      console.warn("Коллекция пуста или не найдена");
      return [];
    }

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as UserData,
    );
  } catch (error) {
    console.error("Ошибка при получении:", error);
    throw error;
  }
};
