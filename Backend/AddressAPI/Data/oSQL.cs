//namespace AddressAPI.Data

using System.Data;
using System.Text.Json;
using System.Data.SqlClient;
using static AddressController;
using AddressAPI.Models;


namespace AddressAPI.Data
{
    public class oSQL : IDisposable
    {
        private SqlConnection searchAddressConn;

        private SqlConnection writeToConn;
        private void connection()
        {

            SqlConnectionStringBuilder builder1 = new SqlConnectionStringBuilder();
            builder1.DataSource = "TONY5IPRO\\SQLEXPRESS";
            builder1.UserID = "DPA_USR";
            builder1.Password = "Anthony!2004";
            builder1.InitialCatalog = "VOI-DW";

            string constring = builder1.ToString();
            searchAddressConn = new SqlConnection(constring);


            SqlConnectionStringBuilder builder2 = new SqlConnectionStringBuilder();
            builder2.DataSource = "TONY5IPRO\\SQLEXPRESS";
            builder2.UserID = "DPA_USR";
            builder2.Password = "Anthony!2004";
            builder2.InitialCatalog = "aPDPA";

            string constring2 = builder2.ToString();
            writeToConn = new SqlConnection(constring2);
        }

        public List<AddressDataModel> getFindAddress(string query)
        {
            connection(); // Assuming this sets up the `searchAddressConn` connection.
            List<AddressDataModel> addresses = new List<AddressDataModel>();

            try
            {
                string sql = "[dbo].[$AddressListSearch]";
                using (SqlCommand cmd = new SqlCommand(sql, searchAddressConn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Query", SqlDbType.NVarChar).Value = query;

                    searchAddressConn.Open();

                    using (SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection))
                    {
                        while (dr.Read())
                        {
                            addresses.Add(new AddressDataModel
                            {
                                FullAddress = dr["Full_Addre"] != DBNull.Value ? dr["Full_Addre"].ToString() : null,
                                VOI_ID = dr["VOI_ID"] != DBNull.Value ? Convert.ToInt32(dr["VOI_ID"]) : 0
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log or handle the exception as needed
                Console.WriteLine("Error: " + ex.Message);
            }
            finally
            {
                if (searchAddressConn.State == ConnectionState.Open)
                {
                    searchAddressConn.Close();
                }
            }

            return addresses;
        }


        public bool InsertVacWatchRecord(FormDataModel formData)
        {
            try
            {
                connection();
                string storedProcedure = "[dbo].[InsertVacWatchRecord]";

                using (SqlCommand cmd = new SqlCommand(storedProcedure, writeToConn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@MadID", SqlDbType.Int).Value = formData.MadID;
                    cmd.Parameters.Add("@FormType", SqlDbType.Int).Value = formData.FormType;
                    cmd.Parameters.Add("@Address", SqlDbType.NVarChar, 250).Value = formData.Address ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 250).Value = formData.Address ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@StartDate", SqlDbType.Date).Value = formData.StartDate;
                    cmd.Parameters.Add("@EndDate", SqlDbType.Date).Value = formData.EndDate;
                    cmd.Parameters.Add("@Cameras", SqlDbType.NVarChar, 10).Value = formData.Cameras ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@LightsOnTimer", SqlDbType.NVarChar, 10).Value = formData.LightsOnTimer ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@ResidentName", SqlDbType.NVarChar, 250).Value = formData.ResidentName ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@ResidentPhone", SqlDbType.NVarChar, 20).Value = formData.ResidentPhone ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@ResidentPhone2", SqlDbType.NVarChar, 20).Value = formData.ResidentPhone2 ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@KeyholderName", SqlDbType.NVarChar, 250).Value = formData.KeyholderName ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@KeyholderPhone", SqlDbType.NVarChar, 20).Value = formData.KeyholderPhone ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@KeyholderPhone2", SqlDbType.NVarChar, 20).Value = formData.KeyholderPhone2 ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@Reason", SqlDbType.NVarChar, 500).Value = formData.Reason ?? (object)DBNull.Value;
                    cmd.Parameters.Add("@Vehicles", SqlDbType.NVarChar, 2000).Value = formData.Vehicles != null && formData.Vehicles.Count > 0
                        ? string.Join(",", formData.Vehicles)
                        : (object)DBNull.Value;

                    writeToConn.Open();
                    cmd.ExecuteNonQuery();
                    writeToConn.Close();

                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error adding record: " + ex.Message);
                return false;
            }
            finally
            {
                if (writeToConn.State == ConnectionState.Open)
                {
                    writeToConn.Close();
                }
            }
        }








        public void Dispose()
        {
            if (searchAddressConn != null)
            {
                searchAddressConn.Dispose();

            }

            //throw new NotImplementedException();
        }
    }


}

