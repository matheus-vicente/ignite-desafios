import { Component, useEffect, useState } from 'react';

import api from '../../services/api';

import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface FoodData {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<FoodData[]>([]);
  const [editingFood, setEditingFood] = useState<FoodData>({} as FoodData);

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    api.get<FoodData[]>('/foods')
      .then(response => setFoods(response.data));
  }, []);

  async function handleAddFood(food: FoodData) {
    try {
      const response = await api.post<FoodData>('/foods', {
        ...food,
        available: true,
      });

      const newFood = response.data;

      setFoods([...foods, newFood]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodData) {
    try {
      const foodUpdated = await api.put<FoodData>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodData) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;