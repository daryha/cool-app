"use client";

import { ArrowRight } from "lucide-react";
import CardArena from "./CardArena";
import { arenaData } from "./../data/arenaData";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchArenas,
  selectAllArenas,
  selectArenasLoading,
  selectArenasError,
} from "./../store/slice/arenaSlice";
import React from "react";
import { fetchCouch, selectAllCouch } from "../store/slice/couchSlice";
import TrainerCard from "./TrainerCard";

const Main = () => {
  const arenas = useSelector(selectAllArenas);
  const coach = useSelector(selectAllCouch);
  const state = useSelector((state) => state.couch.status);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchArenas());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(fetchCouch());
  }, [dispatch]);

  if (state == "loading") {
    return <p>Загрузка...</p>;
  }
  return (
    <>
      <section className="mb-20 mt-40">
        <h2 className="mb-10 text-2xl">Спортивные площадки</h2>
        <div className="flex  justify-between mb-10">
          {arenas.slice(0, 4).map((items, _) => (
            <CardArena
              key={items.id}
              id={items.id}
              discount={items.discount}
              photo={items.photoUrl}
              title={items.name}
              date={items.date}
              price={items.price}
              address={items.address}
            />
          ))}
        </div>
        <div className="flex items-center justify-end group cursor-pointer transition-all">
          <Link href={"arena-list"}>
            <p className="text-color-green  transition-all duration-150 mr-1">
              Показать все площадки
            </p>
          </Link>
          <ArrowRight
            strokeWidth={1}
            className="text-color-green transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </section>

      <section className="mb-20 mt-40">
        <h2 className="mb-10 text-2xl">Наши тренера</h2>
        <div className="flex  justify-between mb-10">
          {coach.slice(0, 4).map((items, _) => (
            <TrainerCard key={items.id} {...items} />
          ))}
        </div>
        <div className="flex items-center justify-end group cursor-pointer transition-all">
          <Link href={"trainer-list"}>
            <p className="text-color-green  transition-all duration-150 mr-1">
              Показать всех
            </p>
          </Link>
          <ArrowRight
            strokeWidth={1}
            className="text-color-green transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </section>

      <section></section>
    </>
  );
};

export default Main;
