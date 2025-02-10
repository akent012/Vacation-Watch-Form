using System.ComponentModel.DataAnnotations;

namespace AddressAPI.Models
{
    public class AddressDataModel
    {
        public string FullAddress { get; set; }
        public int VOI_ID { get; set; }
    }

    public class FormDataModel
    {
        [Required]
        public int MadID { get; set; } // Represents the ID associated with the selected address


        [Required, MaxLength(250)]
        public string Address { get; set; }

        [Required, MaxLength(250)]
        public string residentEmail { get; set; }


        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [MaxLength(10)]
        public string Cameras { get; set; }

        [MaxLength(10)]
        public string LightsOnTimer { get; set; }

        [Required, MaxLength(250)]
        public string ResidentName { get; set; }

        [Required, MaxLength(20)]
        public string ResidentPhone { get; set; }

        [Required, MaxLength(20)]
        public string ResidentPhone2 { get; set; }

        [MaxLength(250)]
        public string KeyholderName { get; set; }

        [MaxLength(20)]
        public string KeyholderPhone { get; set; }

        [MaxLength(20)]
        public string KeyholderPhone2 { get; set; }

        [MaxLength(20)]
        public string FormType { get; set; }

        [MaxLength(500)]
        public string Reason { get; set; }

        public List<string> Vehicles { get; set; } = new List<string>();



    }

}
