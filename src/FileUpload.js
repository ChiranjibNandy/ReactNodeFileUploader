import React, { Fragment, useState } from 'react';
import Notifications from './Notifications';
import ProgressBar from './ProgressBar';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [delimiter, setDelimiter] = useState(",");
  const [lines, setLines] = useState(2);

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:9000/fileAPI', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      let { fileName, fileData } = res.data;
      fileData = fileData.split('\n');

      setUploadedFile({ fileName, fileData });
      setMessage('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {message ? <Notifications msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        <ProgressBar percentage={uploadPercentage} />

        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
      <hr></hr>
      <form>
        <div style={{float:'left'}}>
            <input type="text" placeholder="Delimiter token" value={delimiter} onChange={(e) => setDelimiter(e.target.value)} />
        </div>
        <div style={{float:'right'}}>
            <input type="number" placeholder="Number of Lines" value={lines} onChange={(e) => setLines(e.target.value)} />
        </div>
      </form>
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <table className="table">
                {uploadedFile.fileData && uploadedFile.fileData.slice(0, lines).map((item) => {
                    return <tbody><tr>
                        {item.split(delimiter).map((cells, index) => {
                            return (
                                <td style={{border: '1px solid black'}}>{cells}</td>
                            )})
                        }
                    </tr></tbody>
                })}
            </table>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;