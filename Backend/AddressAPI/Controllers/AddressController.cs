using AddressAPI.Data;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using AddressAPI.Models;




[ApiController]
[Route("api/[controller]")]
public class AddressController : ControllerBase
{
    private readonly oSQL _sqlServer;

    public AddressController()
    {
        _sqlServer = new oSQL();
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchAddresses([FromQuery] string query)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest(new { error = "Query is required." });
            }

            // Update to retrieve a list of objects with Full_Addre and VOI_ID
            List<AddressDataModel> addressData = _sqlServer.getFindAddress(query);

            if (addressData == null || !addressData.Any())
            {
                return NotFound(new { message = "No addresses found matching the query.", query });
            }

            return Ok(addressData); // Return the list of AddressData objects
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An error occurred while fetching addresses.", details = ex.Message });
        }
    }






    [HttpPost("add")]
    public async Task<IActionResult> AddToVacWatchTable([FromBody] FormDataModel formData)
    {
        try
        {
            // Validate the data model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bool isAdded = _sqlServer.InsertVacWatchRecord(formData);

            if (isAdded)
            {
                return Ok(new { message = "Record added successfully." });
            }
            else
            {
                return StatusCode(500, new { error = "An error occurred while adding the record." });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
        }
    }
}
