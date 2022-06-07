import React, {useCallback} from 'react';
import { useDropzone } from 'react-dropzone';
import './styles.scss';

const Dropzone = (props) => {

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    handleGetDocuments(acceptedFiles)
  }, [])


  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({onDrop});
  const {handleGetDocuments} = props
  const files = acceptedFiles.map((file) => (
    <li key={file.path}>{file.path}</li>
  ));
 
  return (
    <section className="container drop-container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>
          Arrastre y suelte archivos aquí, o haga clic para seleccionar archivos
        </p>
      </div>
      {acceptedFiles?.length !== 0 ? (
        <aside>
          <h4>Archivos</h4>
          <ul>{files}</ul>
        </aside>
      ) : null}
    </section>
  );
};

export default Dropzone;
