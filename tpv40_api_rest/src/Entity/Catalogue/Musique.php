<?php

namespace App\Entity\Catalogue;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Musique
 *
 * @ORM\Entity
 */
class Musique extends Article
{
    /**
     * @var string
     *
     * @ORM\Column(name="createur", type="string")
     */
    private $createur;

    /**
     * @var string
     *
     * @ORM\Column(name="date_de_parution", type="string")
     */
    private $dateDeParution;
	
    /**
     * @ORM\OneToMany(targetEntity="Piste", mappedBy="musique")
     */
    private $pistes;
	
	public function __construct()
	{
		$this->pistes = new ArrayCollection();
	}

    /**
     * Set auteur
     *
     * @param string $createur
     *
     * @return Musique
     */
    public function setCreateur($createur)
    {
        $this->createur = $createur;

        return $this;
    }

    /**
     * Get createur
     *
     * @return string
     */
    public function getCreateur()
    {
        return $this->createur;
    }

    /**
     * Set dateDeParution
     *
     * @param string $dateDeParution
     *
     * @return Musique
     */
    public function setDateDeParution($dateDeParution)
    {
        $this->dateDeParution = $dateDeParution;

        return $this;
    }

    /**
     * Get dateDeParution
     *
     * @return string
     */
    public function getDateDeParution()
    {
        return $this->dateDeParution;
    }
	
    /**
     * Get pistes
     *
     * @return array
     */
    public function getpistes()
    {
        return $this->pistes->toArray();
    }
	
	public function addPiste($piste)
	{
		$piste->setMusique($this);
		$this->pistes->add($piste);
	}
}

