import { Button, Container, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material"
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import MessageTwoToneIcon from '@mui/icons-material/MessageTwoTone';
import AddCommentTwoToneIcon from '@mui/icons-material/AddCommentTwoTone';
import 'react-toastify/dist/ReactToastify.css';

import { MagType } from '../../enums/MagTypeEnum';
import CreateComment from '../../components/createComment/CreateComment';
import ListComments from "../../components/listComments/ListComments";
import { ToastContainer, toast } from "react-toastify";
import { getHour } from "../../utils/timeFormat";

const url = process.env.REACT_APP_BACKEND_URL
const Home = () => {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [magTypeFilter, setMagTypeFilter] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openListComments, setOpenListComments] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [comments, setComments] = useState([]);
  const [isThereNewFeatures, SetIsThereNewFeatures] = useState(false);


  const fetchData = useCallback(async () => {
    try {
      const magTypeQueryParam = magTypeFilter.map(type => `mag_type[]=${type}`).join('&');
      const response = await axios.get(`${url}/features/index?page=${page + 1}&rows_per_page=${rowsPerPage}&${magTypeQueryParam}`);
      setData(response.data.data);
      setTotalRows(response.data.meta.pagination.total)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [page, rowsPerPage, magTypeFilter]);


  const handleCreateComment = async (commentContent) => {
    const comment = {
      feature_id: selectedFeatureId,
      comment: commentContent
    }
    try {
      const response = await axios.post(`${url}/comments/create`, comment);
      if (response.data.success) {
        notify('Comment created Successfully')
      }
      return response;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSeismologicalData = async () => {

    const response = await axios.get(`${url}/features/get_and_save_features`);
    if (response.data.dataCount !== 0) {
      notify(`${response.data.dataCount} new ${response.data.dataCount > 1 ? `features` : `feature`}`)
      SetIsThereNewFeatures(!false)
    } else {
      notify(`There's no new features`);
    }
  }

  useEffect(() => {
    fetchData();
  }, [fetchData, isThereNewFeatures]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (newRowsPerPage <= 1000) {
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    } else {
      console.error('Error: rowsPerPage should be less than or equal to 1000');
    }
  };

  const handleMagTypeFilterChange = (event) => {
    setMagTypeFilter(event.target.value);
    setPage(0); // Reset page when filter changes
  };

  const handleActionClick = (id) => {
    setSelectedFeatureId(id)
    setOpenDialog(true); // Open the dialog to create a comment
  };

  const handleActionList = (id) => {
    handleListComments(id)
    setOpenListComments(true); // Open the dialog to visualize the comments
  };

  const handleListComments = async (id) => {
    try {
      const response = await axios.get(`${url}/comments/find_by_feature_id?feature_id=${id}`);
      setComments(response.data.comments)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const notify = (message) => toast(message);

  return (
    <>
      <ToastContainer autoClose={3000} />
      <Container style={{ padding: '40px', maxWidth: 'none', height: '1000px' }}>
        <div>
          <label htmlFor="magTypeFilter">Filter by Magnitude Type:</label>
          <Select
            id="magTypeFilter"
            multiple
            value={magTypeFilter}
            onChange={handleMagTypeFilterChange}
            inputProps={{ name: 'magTypeFilter', id: 'magTypeFilter' }}
          >
            {
              MagType.map((type) => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))
            }
          </Select>
          <Button onClick={() => handleSeismologicalData()} style={{ marginLeft: '20px' }} variant="contained">Get
            seismological data</Button>
        </div>
        <TableContainer component={Paper} style={{ height: '450px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>External Id</TableCell>
                <TableCell>Magnitude</TableCell>
                <TableCell>Place</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Tsunami</TableCell>
                <TableCell>Mag Type</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Longitude</TableCell>
                <TableCell>Latitude</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow >
                  <TableCell>{`There's no Features`}</TableCell>
                </TableRow>
              ) : (
                <>
                  {
                    data?.map((feature) => (
                      <TableRow key={feature.id}>
                        <TableCell>{feature.id}</TableCell>
                        <TableCell>{feature.type}</TableCell>
                        <TableCell>{feature.attributes.external_id}</TableCell>
                        <TableCell>{feature.attributes.magnitude}</TableCell>
                        <TableCell>{feature.attributes.place}</TableCell>
                        <TableCell>{getHour(feature.attributes.time)}</TableCell>
                        <TableCell>{feature.attributes.tsunami ? "Yes" : "No"}</TableCell>
                        <TableCell>{feature.attributes.mag_type}</TableCell>
                        <TableCell>{feature.attributes.title}</TableCell>
                        <TableCell>{feature.attributes.coordinates.longitude}</TableCell>
                        <TableCell>{feature.attributes.coordinates.latitude}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleActionClick(feature.id)} color="primary">
                            <AddCommentTwoToneIcon /> {/* Use Comment icon */}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleActionList(feature.id)} color="primary">
                            <MessageTwoToneIcon /> {/* Use Comment icon */}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100, 250, 500, 1000]} // Options for rows per page
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <CreateComment
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onCreateComment={handleCreateComment}
        />
        <ListComments
          open={openListComments}
          onClose={() => setOpenListComments(false)}
          comments={comments}
        />
      </Container>
    </>

  )
}

export default Home