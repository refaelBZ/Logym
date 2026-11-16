import React from 'react';
import styles from "./style.module.scss";
import { NavLink } from 'react-router-dom';
import { LuStepForward, LuBarChart, LuUserCog } from 'react-icons/lu';

export default function Footer() {
    return (
        <nav className={styles.footer} aria-label="Main">
            <NavLink
                to="/settings"
                className={({ isActive }) => isActive ? styles.active : styles.unActive}
                aria-label="Settings"
            >
                <LuUserCog size={24} aria-hidden="true" />
            </NavLink>
            <NavLink
                to="/home"
                className={({ isActive }) => isActive ? styles.active : styles.unActive}
                aria-label="Workouts"
            >
                <LuStepForward size={24} aria-hidden="true" />
            </NavLink>
            <NavLink
                to="/progress"
                className={({ isActive }) => isActive ? styles.active : styles.unActive}
                aria-label="Progress"
            >
                <LuBarChart size={24} aria-hidden="true" />
            </NavLink>
        </nav>
    );
}
