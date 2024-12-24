import React from 'react';
import styles from "./style.module.scss";
import { NavLink } from 'react-router-dom';
import { LuHome, LuStepForward , LuBarChart,LuUserCog  } from 'react-icons/lu';
export default function Footer() {
    return (
        <>
            <div className={styles.footer}>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : styles.unActive}>
                    <LuUserCog size={24} />
                </NavLink>
                <NavLink to="/home" className={({ isActive }) => isActive ? styles.active : styles.unActive}>
                    <LuStepForward size={24} />
                </NavLink>
                {/* <NavLink to="/workout" className={({ isActive }) => isActive ? styles.active : styles.unActive}>
                    <LuCheckSquare size={24} />
                </NavLink> */}
                <NavLink to="/progress" className={({ isActive }) => isActive ? styles.active : styles.unActive}>
                    <LuBarChart size={24} />
                </NavLink>
            </div>
        </>
    );
}
