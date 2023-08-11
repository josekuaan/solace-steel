/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { uniq } from 'lodash'
import ReactPaginate from 'react-paginate'
import Items from './Items'
export default function Pagination({
  inventoryPerPage,
  totalInventory,
  inventory,
  currentInventory,
}) {
  const [itemOffset, setItemOffset] = useState(0)
  let pageNumber = [1]
  console.log(inventory)
  for (let i = 1; i <= Math.floor(totalInventory / inventoryPerPage); i++) {
    if (i === 1) {
      if (totalInventory === inventoryPerPage) {
        pageNumber.push()
      } else {
        pageNumber.push(2)
      }
    } else {
      pageNumber.push(i)
    }
  }
  pageNumber = uniq(pageNumber)
  console.log(currentInventory)
  const endOffset = itemOffset + inventoryPerPage
  console.log(`Loading items from ${itemOffset} to ${endOffset}`)
  const currentItems = currentInventory.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(currentInventory.length / inventoryPerPage)
  const handlePageClick = (event) => {
    const newOffset = (event.selected * inventoryPerPage) % currentInventory.length
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`)
    setItemOffset(newOffset)
  }

  return (
    <>
      <Items inventory={currentItems} />
      <tr>
        {' '}
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={15}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
        />
      </tr>
    </>
    // <nav className="mt-2">
    //   <ul className="pagination">
    //     {pageNumber.length <= 1
    //       ? ''
    //       : pageNumber.map((number) => (
    //           <li className="page-item" key={number}>
    //             <a onClick={() => paginate(number)} className="page-link">
    //               {number}
    //             </a>
    //           </li>
    //         ))}
    //   </ul>
    // </nav>
  )
}
