/* eslint-disable react/prop-types */
import React from 'react'
import { uniq } from 'lodash'
export default function Pagination({ inventoryPerPage, totalInventory, paginate }) {
  var pageNumber = [1]
  for (let i = 1; i <= Math.floor(totalInventory / inventoryPerPage); i++) {
    if (i === 1) {
      if (totalInventory === inventoryPerPage) {
        pageNumber.push()
      } else {
        // pageNumber.push(2);
      }
    } else {
      pageNumber.push(i)
    }
  }
  pageNumber = uniq(pageNumber)

  return (
    <nav className="mt-2 table-responsive">
      <ul className="pagination">
        {pageNumber.length <= 1
          ? ''
          : pageNumber.map((number) => (
              <li className="page-item" key={number}>
                <a onClick={() => paginate(number)} className="page-link">
                  {number}
                </a>
              </li>
            ))}
      </ul>
    </nav>
  )
}
