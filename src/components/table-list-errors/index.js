import ReactPaginate from 'react-paginate';
import React, { useEffect, useState } from 'react';
import ImageSearch from '../../assets/icons8-search.svg';
import { useForm } from 'react-hook-form';
import './styles.scss';

const Items = (props) => {
  const { currentItems, getErrorByID, ontop, searchError, flagStatus } = props;
  const { register, handleSubmit, reset } = useForm();
  const insuranceCompany = sessionStorage.getItem('insuranceCompany');
  const openError = (id) => {
    getErrorByID(id);
    ontop();
  };
  return (
    <>
      <div className="search-list-container">
        <input
          placeholder="Buscar..."
          {...register('text', {
            onChange: (e) => {
              searchError(e.target.value);
            },
          })}
        />
        <img src={ImageSearch} />
      </div>
      <div
        className={insuranceCompany === 'OCEANICA' ? 'items-oceanica' : 'items'}
      >
        <div
          className={flagStatus!="N"?"header-table-error":"header-table-error table-custom"}
          style={{
            backgroundColor:
              insuranceCompany === 'OCEANICA' ? '#47C0B6' : '#CC2229',
          }}
        >
          <div>FECHA</div>
          <div>#TICKET</div>
          <div>SERVICIO</div>
          {flagStatus!="N"?
            <div>ATENDIDO POR</div>
          :null}
          <div className="padding-left-desktop">MENSAJE DE ERROR</div>
        </div>
        {currentItems?.map((item, index) => (
          <div
            onClick={() => openError(item.ID_ERROR_LOG)}
            className={(index % 2 === 1 ? 'item-list not-par' : 'item-list')+ ( flagStatus!="N"?" ":" table-custom")}
            key={index}
          >
            <div>
              <label className="title-responsive">Fecha: </label>
              {item.DATE_ERROR}
            </div>
            <div>
              <label className="title-responsive">#TICKET: </label>
              {item.ID_ERROR_LOG}
            </div>
            <div>
              <label className="title-responsive">Usuario: </label>
              {item.ERROR_USER}
            </div>
            {flagStatus!="N"?
              <div >
                <label className="title-responsive">Atendido por: </label>
                {item.COD_USER}
              </div>
            :null}
            <div className="message-error-code padding-left-desktop">
              <label className="title-responsive">Mensaje de error: </label>
              {item.EXCEPTION_MESSAGE}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

function TableListErrors({
  itemsPerPage,
  items,
  getErrorByID,
  pageCount,
  setPageCount,
  itemOffset,
  setItemOffset,
  currentItems,
  setCurrentItems,
  ontop,
  flagStatus
}) {
  // We start with an empty list of items.

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [activePage, setActivePage] = useState(itemOffset / 10);
  const [errors, setErrors] = useState(items);
  const [errorsPerPage, setErrorsPerPage] = useState(itemsPerPage);

  const insuranceCompany = sessionStorage.getItem('insuranceCompany');
  const searchError = (text) => {
    const result = items.filter(
      (item) =>
        item.EXCEPTION_MESSAGE.toLowerCase().indexOf(text.toLowerCase()) !=
          -1 ||
        item.ERROR_USER.toLowerCase().indexOf(text.toLowerCase()) != -1 ||
        item.APPLICATION_MESSAGE.toLowerCase().indexOf(text.toLowerCase()) !=
          -1 ||
        item.APPLICATION.toLowerCase().indexOf(text.toLowerCase()) != -1
    );
    setCurrentItems(result);
    setErrorsPerPage(100000);
    if (text === '') {
      setErrorsPerPage(itemsPerPage);
    }
  };

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + errorsPerPage;
    setCurrentItems(errors.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(errors.length / errorsPerPage));
    setActivePage(itemOffset / 10);
  }, [itemOffset, errorsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * errorsPerPage) % errors.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items
        currentItems={currentItems}
        getErrorByID={getErrorByID}
        ontop={ontop}
        searchError={searchError}
        flagStatus={flagStatus}
      />
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        className={
          insuranceCompany === 'OCEANICA'
            ? 'pagination container-oceanica '
            : 'pagination container-piramide '
        }
        initialPage={activePage}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

// Add a <div id="container"> to your HTML to see the componend rendered.

export default TableListErrors;
