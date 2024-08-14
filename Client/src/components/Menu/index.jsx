import React from 'react'

export default function Menu(options=[{name:"Delate",onclick:()=>{}}, "Edit", "Rename", "Duplicate"]) {
  return (
    <div>
      {fruits.map((option) => (
        <div   key={option}>
            {option.name}
        </div>
    
      ))}
    </div>
  )
}
